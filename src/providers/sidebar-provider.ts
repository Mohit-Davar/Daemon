import * as vscode from 'vscode';
import { CONSTANTS } from '@/lib/constants';
import { getWebviewContent } from '@/lib/webview-utils';
import { ChatService } from '@/services/chat-service';
import { StateManager } from '@/services/state-manager';
import { WebviewMessage } from '@/types';

export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewId = CONSTANTS.VIEW_ID;
  private _view?: vscode.WebviewView;
  private _chatService?: ChatService;

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
    this._chatService = new ChatService(stateManager, webview);

    webview.onDidReceiveMessage(async (message: WebviewMessage) => {
      if (this._chatService) {
        await this._chatService.handleMessage(message);
      }
    });
  }

  // Helper method to send messages to the webview from commands
  public postMessage(message: WebviewMessage) {
    if (this._view) {
      this._view.webview.postMessage(message);
    }
  }
}
