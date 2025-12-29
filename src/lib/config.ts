import * as vscode from 'vscode';
import { CONSTANTS } from './constants';

export class ConfigManager {
  static getApiKey(): string | undefined {
    return vscode.workspace
      .getConfiguration(CONSTANTS.CONFIG.SECTION)
      .get<string>(CONSTANTS.CONFIG.API_KEY);
  }
}
