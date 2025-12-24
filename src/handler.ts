import * as vscode from 'vscode';

import { queryLLM } from './api';

interface WebviewMessage {
  command: string;
  text: string;
}

export async function handleQuery(message: WebviewMessage, webview: vscode.Webview) {
  const apiKey = vscode.workspace.getConfiguration('daemon').get<string>('groq.apiKey');

  if (!apiKey) {
    webview.postMessage({
      command: 'error',
      text: 'API key not found.',
    });
    return;
  }

  try {
    for await (const token of queryLLM(apiKey, message.text)) {
      webview.postMessage({
        command: 'stream',
        text: token,
      });
    }
    webview.postMessage({
      command: 'done',
      text: 'stream finished',
    });
  } catch {
    webview.postMessage({
      command: 'error',
      text: 'An error occurred while processing your request.',
    });
  }
}
