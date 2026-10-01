import * as vscode from 'vscode';

import { CONSTANTS } from '@/extension/lib/constants';
import { SidebarProvider } from '@/extension/providers/sidebar-provider';
import { StateManager } from '@/extension/services/state-manager';

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
        data: stateManager.getConvos(),
      });
    }),

    vscode.commands.registerCommand(CONSTANTS.COMMANDS.LOGOUT, () => {
      provider.postMessage({
        command: 'logout',
      });
    }),
  );
}

export function deactivate() {}
