import * as vscode from 'vscode';

import { CONSTANTS } from '@/lib/constants';
import { SidebarProvider } from '@/providers/sidebar-provider';
import { StateManager } from '@/services/state-manager';

export function activate(context: vscode.ExtensionContext) {
  const provider = new SidebarProvider(context, context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(SidebarProvider.viewId, provider),
  );

  const stateManager = new StateManager(context);

  context.subscriptions.push(
    vscode.commands.registerCommand(CONSTANTS.COMMANDS.NEW_CONVERSATION, () => {
      provider.postMessage({
        command: 'addChat',
      });
    }),

    vscode.commands.registerCommand(CONSTANTS.COMMANDS.CHAT_HISTORY, () => {
      provider.postMessage({
        command: 'toggleHistory',
        data: {
          convos: stateManager.getConvos(),
        },
      });
    }),
  );
}

export function deactivate() {}
