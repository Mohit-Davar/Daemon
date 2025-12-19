import * as vscode from 'vscode';

import { handleQuery } from '@/handler';
import { getHTML } from '@/utils';

export class DaemonView implements vscode.WebviewViewProvider {
  public static readonly viewId = 'daemonView';

  constructor(private readonly extensionUri: vscode.Uri) { }

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    const { webview } = webviewView;

    webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.extensionUri, 'src', 'view', 'dist'),
      ],
    };

    webview.html = getHTML(webview, this.extensionUri);

    webview.onDidReceiveMessage(async (message) => {
      await handleQuery(message, webview);
    });
  }
}