import * as vscode from 'vscode';

import { queryLLM } from '@/api';
import { Convo, WebviewMessage } from '@/types';

export class ConvoController {
  private convos: Convo[];

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly webview: vscode.Webview,
  ) {
    this.convos = context.workspaceState.get<Convo[]>('convos', []);
  }

  private async persist() {
    await this.context.workspaceState.update('convos', this.convos);
  }

  private async handleQuery(data: WebviewMessage['data']) {
    // @ts-expect-error IDK
    const { convo, messages } = data;

    const apiKey = vscode.workspace.getConfiguration('daemon').get<string>('groq.apiKey');
    if (!apiKey) {
      this.webview.postMessage({
        command: 'error',
        text: 'API key not found',
      });
      return;
    }

    let currentConvo = this.convos.find((c) => c.id === convo.id);
    if (!currentConvo) {
      if (!convo.title || typeof convo.createdAt !== 'number') {
        this.webview.postMessage({
          command: 'error',
          text: 'Failed to create new conversation.',
        });
        return;
      }
      currentConvo = {
        id: convo.id,
        title: convo.title,
        messages: [],
        createdAt: convo.createdAt,
        updatedAt: convo.createdAt,
      };
      this.convos.push(currentConvo);
    }

    currentConvo.messages.push(...messages);
    currentConvo.updatedAt = Date.now();

    const messagesForLLM = currentConvo.messages.slice(0, -1).map((m) => ({
      role: m.sender,
      content: m.text,
    }));

    try {
      for await (const token of queryLLM(apiKey, messagesForLLM)) {
        const last = currentConvo.messages.at(-1);
        if (last && last.sender === 'assistant') {
          last.text += token;
        }
        this.webview.postMessage({
          command: 'stream',
          text: token,
        });
      }

      await this.persist();

      this.webview.postMessage({ command: 'streamDone' });
    } catch (err) {
      console.error(err);
      this.webview.postMessage({
        command: 'error',
        text: 'Query failed',
      });
    }
  }

  private hydrateWebView() {
    this.webview.postMessage({
      command: 'hydrate',
      data: { convos: this.context.workspaceState.get<Convo[]>('convos', []) },
    });
  }

  public async handleMessage(message: WebviewMessage) {
    switch (message.command) {
      case 'query':
        await this.handleQuery(message.data);
        break;
      case 'webviewLoaded':
        this.hydrateWebView();
        break;
      default:
        console.error('Unknown Command');
        break;
    }
  }
}
