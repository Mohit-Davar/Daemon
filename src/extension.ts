import * as vscode from 'vscode';

import { DaemonView } from '@/view';

export function activate(context: vscode.ExtensionContext) {

	const provider = new DaemonView(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			DaemonView.viewId,
			provider
		)
	);
}

export function deactivate(){}
