import * as vscode from 'vscode';

import { streamResponse } from '@/extension/lib/utils';
import { AuthService } from '@/extension/services/auth-service';
import { StateManager } from '@/extension/services/state-manager';
import { Convo, WebviewMessage } from '@/extension/types';

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
    }
  }

  private hydrateWebView() {
    this.webview.postMessage({
      command: 'hydrate',
      data: this.convos,
    });
  }

  private async handleQuery(data: { convo: Convo; messages: Convo['messages'] }) {
    const { convo, messages } = data;
    const accessToken = await this.authService.getAccessToken();

    if (!accessToken) {
      this.webview.postMessage({ command: 'error', text: 'Sign in to chat' });
      return;
    }

    // Get or create conversation
    let current = this.convos.find((c) => c.id === convo.id);
    if (!current) {
      current = { ...convo, messages: [] };
      this.convos.push(current);
    }

    current.messages.push(...messages);
    const assistantMsg = current.messages.at(-1);
    const history = current.messages.slice(0, -1).map((m) => ({
      role: m.sender,
      content: m.text,
    }));

    await streamResponse(
      'http://localhost:3000/api/chat',
      { messages: history },
      {
        onToken: (t) => {
          if (assistantMsg) assistantMsg.text += t;
          this.webview.postMessage({ command: 'stream', text: t });
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
