import * as vscode from 'vscode';

import { DaemonView } from '@/view';

export function activate(context: vscode.ExtensionContext) {
  const provider = new DaemonView(context.extensionUri, context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(DaemonView.viewId, provider),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('daemon.newConversation', () => {
      provider.postMessage({ command: 'addChat' });
    }),

    vscode.commands.registerCommand('daemon.chatHistory', () => {
      provider.postMessage({
        command: 'toggleHistory',
        data: {
          convos: context.workspaceState.get('convos', []),
        },
      });
    }),
  );
}

export function deactivate() {}
