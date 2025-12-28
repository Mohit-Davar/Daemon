import * as vscode from 'vscode';

import { ConvoController } from '@/handler';
import { getHTML } from '@/utils';

export class DaemonView implements vscode.WebviewViewProvider {
  public static readonly viewId = 'daemonView';
  private controller?: ConvoController;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly context: vscode.ExtensionContext,
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    const { webview } = webviewView;

    webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'src', 'view', 'dist')],
    };

    webview.html = getHTML(webview, this.extensionUri);
    this.controller = new ConvoController(this.context, webview);

    webview.onDidReceiveMessage(async (message) => {
      const { command, data } = message;
      switch (command) {
        case 'query':
          await this.controller?.handleQuery(data);
          break;
        default:
          // ignore unknown commands
          break;
      }
    });
  }
}
