const vscode = acquireVsCodeApi();

export type VSCodeMessage = {
  command: string;
  data?: unknown;
};

export const VSCode = {
  postMessage: (message: VSCodeMessage) => {
    vscode.postMessage(message);
  },
};
