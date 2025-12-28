import * as vscode from 'vscode';

import { queryLLM } from '@/api';
import { getTitle } from '@/utils';

export class ConvoController {
  private convos: Convos[];

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly webview: vscode.Webview,
  ) {
    this.convos = context.workspaceState.get<Convos[]>('convos', []);
  }

  private async persist() {
    await this.context.workspaceState.update('convos', this.convos);
  }

  async handleQuery(data: QueryMessage['data']) {
    const { query, ID } = data;

    const apiKey = vscode.workspace.getConfiguration('daemon').get<string>('groq.apiKey');
    if (!apiKey) {
      this.webview.postMessage({
        command: 'error',
        text: 'API key not found',
      });
      return;
    }

    let convo = this.convos.find((c) => c.id === ID);
    if (!convo) {
      convo = {
        id: ID,
        title: getTitle(query),
        messages: [],
      };
      this.convos.push(convo);
    }

    const userMsg = { sender: 'user' as const, text: query };
    convo.messages.push(userMsg);

    const aiMsg = { sender: 'ai' as const, text: '' };
    convo.messages.push(aiMsg);

    try {
      for await (const token of queryLLM(apiKey, query)) {
        aiMsg.text += token;
        this.webview.postMessage({
          command: 'stream',
          text: token,
        });
      }

      await this.persist();

      this.webview.postMessage({
        command: 'done',
        text: '',
      });
    } catch {
      this.webview.postMessage({
        command: 'error',
        text: 'Query failed',
      });
    }
  }
}
