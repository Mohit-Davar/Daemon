import * as vscode from 'vscode';

import { StateManager } from '@/services/state-manager';
import { Convo, WebviewMessage } from '@/types';
import { streamResponse } from '@/lib/utils';

export class ChatService {
  private convos: Convo[];

  constructor(
    private readonly stateManager: StateManager,
    private readonly webview: vscode.Webview,
  ) {
    this.convos = this.stateManager.getConvos();
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
        console.error('Unknown Command', message.command);
    }
  }

  private hydrateWebView() {
    this.webview.postMessage({
      command: 'hydrate',
      data: { convos: this.convos },
    });
  }

  private async handleQuery(data: unknown) {
    // @ts-expect-error IDK
    const { convo, messages } = data;

    let currentConvo = this.convos.find((c) => c.id === convo.id);
    // Create new conversation if it doesn't exist
    if (!currentConvo) {
      if (!convo.id || !convo.title || !convo.createdAt) {
        this.webview.postMessage({
          command: 'error',
          text: 'Invalid conversation data',
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

    const context = currentConvo.messages.slice(0, -1).map((m) => ({
      role: m.sender,
      content: m.text,
    }));

    const lastMessage = currentConvo.messages.at(-1);
    if (!lastMessage || lastMessage.sender !== 'assistant') {
      this.webview.postMessage({
        command: 'error',
        text: 'Internal Server Error: no assistant message to stream to.',
      });
      return;
    }

    await streamResponse(
      'http://localhost:3000/api/chat',
      { messages: context },
      {
        onToken: (token: string) => {
          lastMessage.text += token;
          this.webview.postMessage({
            command: 'stream',
            text: token,
          });
        },
        onDone: async () => {
          await this.stateManager.saveConvos(this.convos);
          this.webview.postMessage({
            command: 'streamDone',
          });
        },
        onError: (error: Error) => {
          console.error('Error during server communication:', error);
          this.webview.postMessage({
            command: 'error',
            text: 'Internal Server Error',
          });
        },
      },
    );
  }
}
