import * as vscode from 'vscode';

import { streamResponse } from '@/extension/lib/utils';
import { AuthService } from '@/extension/services/auth-service';
import { StateManager } from '@/extension/services/state-manager';
import { Convo, WebviewMessage } from '@/extension/types';

const MAX_CONTEXT_CHARS = 8000;

export class ChatService {
  private convos: Convo[];

  constructor(
    private readonly stateManager: StateManager,
    private readonly webview: vscode.Webview,
    private readonly authService: AuthService,
  ) {
    this.convos = this.stateManager.getConvos();
  }

  public async handleMessage(message: WebviewMessage) {
    switch (message.command) {
      case 'query':
        return await this.handleQuery(
          message.data as { convo: Convo; messages: Convo['messages'] },
        );
      case 'webviewLoaded':
        return this.hydrateWebView();
      case 'insertCode':
        return await this.insertCodeAtCursor(message.data as { code: string });
      case 'renameConvo':
        return await this.renameConvo(message.data as { id: string; title: string });
      case 'deleteConvo':
        return await this.deleteConvo(message.data as { id: string });
      case 'getContext':
        return this.sendEditorContext();
    }
  }

  private hydrateWebView() {
    this.webview.postMessage({
      command: 'hydrate',
      data: this.convos,
    });
    // Also send current editor context so the badge is populated on load
    this.sendEditorContext();
  }

  private sendEditorContext() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      this.webview.postMessage({ command: 'setContext', data: null });
      return;
    }
    this.webview.postMessage({
      command: 'setContext',
      data: {
        fileName: editor.document.fileName.split(/[\\/]/).pop() ?? '',
        languageId: editor.document.languageId,
      },
    });
  }

  private async insertCodeAtCursor(data: { code: string }) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      this.webview.postMessage({ command: 'error', text: 'No active editor to insert into.' });
      return;
    }

    const position = editor.selection.active;
    await editor.edit((builder) => {
      builder.insert(position, data.code);
    });

    // Move cursor to end of inserted text
    await vscode.commands.executeCommand('editor.action.formatDocument');
  }

  private async renameConvo(data: { id: string; title: string }) {
    const convo = this.convos.find((c) => c.id === data.id);
    if (!convo) return;

    convo.title = data.title;
    convo.updatedAt = Date.now();
    await this.stateManager.saveConvos(this.convos);

    // Also sync to server if authenticated
    const accessToken = await this.authService.getAccessToken();
    if (accessToken) {
      try {
        await fetch(`http://localhost:3000/api/conversations/${data.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ title: data.title }),
        });
      } catch {
        // Non-critical — local state is already updated
      }
    }
  }

  private async deleteConvo(data: { id: string }) {
    this.convos = this.convos.filter((c) => c.id !== data.id);
    await this.stateManager.saveConvos(this.convos);

    // Echo back so the webview can pick a new active convo
    this.webview.postMessage({
      command: 'convoDeleted',
      data: { id: data.id },
    });

    // Also sync to server if authenticated
    const accessToken = await this.authService.getAccessToken();
    if (accessToken) {
      try {
        await fetch(`http://localhost:3000/api/conversations/${data.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } catch {
        // Non-critical
      }
    }
  }

  private getEditorContext(): string | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return undefined;

    const doc = editor.document;
    const languageId = doc.languageId;

    // Ignore binary/output files
    const ignoredLanguages = ['log', 'binary', 'pdf', 'image', 'video'];
    if (ignoredLanguages.includes(languageId)) return undefined;

    // Prefer selected text; fall back to full file (truncated)
    const selection = editor.selection;
    const selectedText = !selection.isEmpty ? doc.getText(selection) : '';

    const fileContent = selectedText || doc.getText().slice(0, MAX_CONTEXT_CHARS);
    const fileName = doc.fileName.split(/[\\/]/).pop() ?? 'file';
    const relativePath = vscode.workspace.asRelativePath(doc.uri);

    const truncationNote =
      !selectedText && doc.getText().length > MAX_CONTEXT_CHARS
        ? '\n\n[File truncated — showing first 8000 characters]'
        : '';

    return `Path: ${relativePath}\nFile: ${fileName} (${languageId})\n\`\`\`${languageId}\n${fileContent}${truncationNote}\n\`\`\``;
  }

  private async handleQuery(data: { convo: Convo; messages: Convo['messages'] }) {
    const { convo, messages } = data;
    const accessToken = await this.authService.getAccessToken();

    if (!accessToken) {
      this.webview.postMessage({ command: 'error', text: 'Sign in to chat' });
      return;
    }

    // Get or create conversation in local state
    let current = this.convos.find((c) => c.id === convo.id);
    if (!current) {
      current = { ...convo, messages: [] };
      this.convos.push(current);
    }

    current.messages.push(...messages);
    const assistantMsg = current.messages.at(-1);
    const history = current.messages.slice(0, -1).map((m) => ({
      role: m.sender as 'user' | 'assistant',
      content: m.text,
    }));

    // Gather editor context
    const context = this.getEditorContext();

    await streamResponse(
      'http://localhost:3000/api/chat',
      {
        messages: history,
        convoId: convo.id,
        convoTitle: convo.title,
        context,
      },
      {
        onToken: (t) => {
          if (assistantMsg) assistantMsg.text += t;
          this.webview.postMessage({ command: 'stream', text: t });
        },
        onConvoId: (id) => {
          if (current) {
            current.id = id;
            this.stateManager.saveConvos(this.convos);
          }
        },
        onDone: () => {
          this.stateManager.saveConvos(this.convos);
          this.webview.postMessage({ command: 'streamDone' });
        },
        onError: () => this.webview.postMessage({ command: 'error', text: 'Chat failed' }),
      },
      { Authorization: `Bearer ${accessToken}` },
    );
  }
}
