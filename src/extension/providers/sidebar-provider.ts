import * as vscode from 'vscode';

import { CONSTANTS } from '@/extension/lib/constants';
import { getWebviewContent } from '@/extension/lib/utils';
import { AuthService } from '@/extension/services/auth-service';
import { ChatService } from '@/extension/services/chat-service';
import { StateManager } from '@/extension/services/state-manager';
import { WebviewMessage } from '@/extension/types';

export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewId = CONSTANTS.VIEW_ID;
  private _view?: vscode.WebviewView;
  private _chatService?: ChatService;
  private _authService?: AuthService;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly extensionUri: vscode.Uri,
  ) {}

  public resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView;
    const { webview } = webviewView;

    webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'src', 'view', 'dist')],
    };

    webview.html = getWebviewContent(webview, this.extensionUri);

    const stateManager = new StateManager(this.context);
    this._authService = new AuthService(webview, stateManager);
    this._chatService = new ChatService(stateManager, webview, this._authService);

    webview.onDidReceiveMessage(async (message: WebviewMessage) => {
      await this._authService?.handleMessage(message);
      await this._chatService?.handleMessage(message);
    });
  }

  // Helper method to send messages to the webview from commands
  public postMessage(message: WebviewMessage) {
    this._view?.webview.postMessage(message);
  }
}
