import * as vscode from 'vscode';

import { User, WebviewMessage } from '@/types';

export class AuthService {
  constructor(private readonly webview: vscode.Webview) {}

  public async handleMessage(message: WebviewMessage) {
    switch (message.command) {
      case 'login':
        await this.handleLogin();
        break;
      case 'logout':
        await this.handleLogout();
        break;
      case 'checkAuth':
        await this.handleCheckAuth();
        break;
      default:
        console.error('Unknown Auth Command', message.command);
    }
  }

  private async handleLogin() {
    try {
      const session = await vscode.authentication.getSession('github', ['read:user'], {
        createIfNone: true,
      });
      if (session) {
        const user: User = {
          id: session.account.id,
          username: session.account.label,
          photo: `https://unavatar.io/github/${session.account.label}`,
        };
        this.webview.postMessage({ command: 'authSuccess', data: user });
      }
    } catch (error) {
      console.error('Login failed', error);
      this.webview.postMessage({ command: 'authSuccess', data: null });
    }
  }

  private async handleLogout() {
    // VS Code doesn't have a direct "sign out" for all sessions via API easily without provider-specific logic
    // but we can just notify our UI. The user can sign out via the Accounts menu in VS Code.
    this.webview.postMessage({ command: 'authSuccess', data: null });
  }

  private async handleCheckAuth() {
    try {
      const session = await vscode.authentication.getSession('github', ['read:user'], {
        createIfNone: false,
      });
      if (session) {
        const user: User = {
          id: session.account.id,
          username: session.account.label,
          photo: `https://unavatar.io/github/${session.account.label}`,
        };
        this.webview.postMessage({ command: 'authSuccess', data: user });
      } else {
        this.webview.postMessage({ command: 'authSuccess', data: null });
      }
    } catch (error) {
      console.error('Auth check failed', error);
      this.webview.postMessage({ command: 'authSuccess', data: null });
    }
  }

  public async getAccessToken(): Promise<string | null> {
    try {
      const session = await vscode.authentication.getSession('github', ['read:user'], {
        createIfNone: false,
      });
      return session?.accessToken ?? null;
    } catch (error) {
      console.error('Failed to get access token', error);
      return null;
    }
  }
}
