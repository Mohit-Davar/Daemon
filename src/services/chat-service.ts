import * as vscode from 'vscode';

import { ConfigManager } from '@/lib/config';
import { AIService } from '@/services/ai-service';
import { StateManager } from '@/services/state-manager';
import { Convo, WebviewMessage } from '@/types';

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

  private async handleQuery(data: WebviewMessage['data']) {
    // @ts-expect-error IDK
    const { convo, messages } = data;

    const apiKey = ConfigManager.getApiKey();
    if (!apiKey) {
      this.webview.postMessage({
        command: 'error',
        text: 'API key not found',
      });
      return;
    }

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

    const messagesForLLM = currentConvo.messages.slice(0, -1).map((m) => ({
      role: m.sender,
      content: m.text,
    }));

    // Start Streaming
    const aiService = new AIService(apiKey);
    try {
      for await (const token of aiService.streamResponse(messagesForLLM)) {
        const last = currentConvo.messages.at(-1);
        if (last && last.sender === 'assistant') {
          last.text += token;
        }
        this.webview.postMessage({
          command: 'stream',
          text: token,
        });
      }

      await this.stateManager.saveConvos(this.convos);
      this.webview.postMessage({
        command: 'streamDone',
      });
    } catch {
      this.webview.postMessage({
        command: 'error',
        text: 'Query failed',
      });
    }
  }
}
