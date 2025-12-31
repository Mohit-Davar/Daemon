import * as vscode from 'vscode';

export function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'src', 'view', 'dist', 'assets', 'index.js'),
  );
  const styleUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'src', 'view', 'dist', 'assets', 'index.css'),
  );

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Daemon</title>
        <link rel="stylesheet" crossorigin href="${styleUri}" />
      </head>
      <body>
        <div id="root"></div>
        <script type="module" crossorigin src="${scriptUri}"></script>
      </body>
    </html>`;
}

export interface StreamResponseCallbacks {
  onToken: (token: string) => void;
  onDone: () => void;
  onError: (error: Error) => void;
}

export async function streamResponse(
  url: string,
  body: object,
  callbacks: StreamResponseCallbacks,
): Promise<void> {
  const { onToken, onDone, onError } = callbacks;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Server request failed: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || ''; // Keep the last, possibly incomplete, part

      for (const part of parts) {
        if (!part.startsWith('data:')) {
          continue;
        }

        const json = part.substring(5).trim();
        if (!json) {
          continue;
        }

        try {
          const payload = JSON.parse(json);
          const token = payload.token;

          if (token === '[DONE]') {
            continue;
          }
          if (token === '[ERROR]') {
            throw new Error('Server-side error during stream.');
          }

          if (token) {
            onToken(token);
          }
        } catch (e) {
          console.error('Failed to parse stream chunk', json, e);
        }
      }
    }
    onDone();
  } catch (error) {
    console.error('Error in streamResponse:', error);
    onError(error instanceof Error ? error : new Error(String(error)));
  }
}
