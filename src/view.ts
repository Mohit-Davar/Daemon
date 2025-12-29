import * as vscode from 'vscode';

import { ConvoController } from '@/handler';
import { getHTML } from '@/utils';

export class DaemonView implements vscode.WebviewViewProvider {
  public static readonly viewId = 'daemonView';
  private _view?: vscode.WebviewView;
  private _controller?: ConvoController;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly context: vscode.ExtensionContext,
  ) {}

  public resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView;
    const { webview } = webviewView;

    webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'src', 'view', 'dist')],
    };

    webview.html = getHTML(webview, this.extensionUri);
    this._controller = new ConvoController(this.context, webview);

    webview.onDidReceiveMessage(async (message) => {
      if (this._controller) {
        await this._controller.handleMessage(message);
      }
    });
  }

  public postMessage(message: WebviewMessage) {
    if (this._view) {
      this._view.webview.postMessage(message);
    }
  }
}
