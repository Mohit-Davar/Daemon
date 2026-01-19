import * as vscode from 'vscode';
import { User, WebviewMessage } from '@/extension/types';
import { StateManager } from '@/extension/services/state-manager';

export class AuthService {
  constructor(
    private readonly webview: vscode.Webview,
    private readonly stateManager: StateManager,
  ) {}

  async handleMessage(message: WebviewMessage) {
    switch (message.command) {
      case 'login':
        return this.login();

      case 'logout':
        return this.logout();

      case 'checkAuth':
        return this.checkAuth();
    }
  }

  private async login() {
    try {
      const session = await vscode.authentication.getSession('github', ['read:user'], {
        createIfNone: true,
      });

      if (!session) return this.sendUser(null);

      await this.stateManager.setLoggedOut(false);
      const user = this.buildUser(session);
      await this.syncUser(user, session.accessToken);
      this.sendUser(user);
    } catch (e) {
      console.error('Login failed', e);
      this.sendUser(null);
    }
  }

  private async logout() {
    await this.stateManager.setLoggedOut(true);
    this.sendUser(null);
  }

  private async checkAuth() {
    if (this.stateManager.getLoggedOut()) {
      return this.sendUser(null);
    }

    try {
      const session = await vscode.authentication.getSession('github', ['read:user'], {
        createIfNone: false,
      });

      if (session) {
        const user = this.buildUser(session);
        await this.syncUser(user, session.accessToken);
        this.sendUser(user);
      } else {
        this.sendUser(null);
      }
    } catch (e) {
      console.error('Auth check failed', e);
      this.sendUser(null);
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const session = await vscode.authentication.getSession('github', ['read:user'], {
        createIfNone: false,
      });
      return session?.accessToken ?? null;
    } catch (e) {
      console.error('Token fetch failed', e);
      return null;
    }
  }

  private async syncUser(user: User, token: string) {
    try {
      await fetch('http://localhost:3000/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: user.username,
          photo: user.photo,
        }),
      });
    } catch (e) {
      console.error('Sync failed', e);
    }
  }

  private buildUser(session: vscode.AuthenticationSession): User {
    const username = session.account.label;
    return {
      id: session.account.id,
      username,
      photo: `https://unavatar.io/github/${username}`,
    };
  }

  private sendUser(user: User | null) {
    this.webview.postMessage({
      command: 'authSuccess',
      data: user,
    });
  }
}
