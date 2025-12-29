import { useEffect } from 'react';

import { useChatStore } from '@/store/chat';
import { useUIStore } from '@/store/ui';
import { vscode } from '@/vscode';

export function useMessageHandler() {
  useEffect(() => {
    const handleMessage = ({ data }: MessageEvent) => {
      const chatStore = useChatStore.getState();
      const uiStore = useUIStore.getState();
      switch (data.command) {
        case 'stream':
          chatStore.appendToken(data.text);
          break;
        case 'streamDone':
          uiStore.toggleLoading();
          break;
        case 'addChat':
          const id = chatStore.createConvo();
          chatStore.setActiveConvo(id);
          break;
        case 'toggleHistory':
          uiStore.toggleHistory();
          chatStore.setConvos(data.data.convos);
          break;
        case 'hydrate': {
          chatStore.setConvos(data.data.convos);
          // If no convos, create one
          if (data.data.convos.length === 0) {
            const id = chatStore.createConvo();
            chatStore.setActiveConvo(id);
          } else {
            // Set active to first one
            chatStore.setActiveConvo(data.data.convos[0].id);
          }
          break;
        }
        case 'error':
          console.error(data.text);
          break;
      }
    };
    window.addEventListener('message', handleMessage);

    // Signal backend that we are ready
    vscode.postMessage({
      command: 'webviewLoaded',
    });

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
}
