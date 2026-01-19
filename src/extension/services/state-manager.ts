import * as vscode from 'vscode';
import { CONSTANTS } from '@/extension/lib/constants';
import type { Convo } from '@/extension/types';

export class StateManager {
  constructor(private readonly context: vscode.ExtensionContext) {}

  public getConvos(): Convo[] {
    return this.context.workspaceState.get<Convo[]>(CONSTANTS.STORAGE.CONVOS, []);
  }

  public async saveConvos(convos: Convo[]): Promise<void> {
    await this.context.workspaceState.update(CONSTANTS.STORAGE.CONVOS, convos);
  }
}
