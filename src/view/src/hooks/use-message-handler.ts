import { useEffect } from 'react';

import { useAuthStore } from '@/features/auth/store/auth-store';
import { useChatStore } from '@/features/chat/store/chat-store';
import { VSCode } from '@/lib/vscode';
import { useUIStore } from '@/store/ui-store';

export function useMessageHandler() {
  useEffect(() => {
    const handleMessage = ({ data }: MessageEvent) => {
      const chatStore = useChatStore.getState();
      const uiStore = useUIStore.getState();
      const authStore = useAuthStore.getState();

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
          chatStore.setConvos(data.data);
          break;

        case 'hydrate': {
          console.log(data);
          chatStore.setConvos(data.data);
          if (data.data.length === 0) {
            const id = chatStore.createConvo();
            chatStore.setActiveConvo(id);
          } else {
            chatStore.setActiveConvo(data.data[0].id);
          }
          break;
        }

        case 'authSuccess':
          authStore.setUser(data.data);
          break;

        case 'error':
          console.error(data.text);
          break;
      }
    };
    window.addEventListener('message', handleMessage);

    // Signal backend that we are ready
    VSCode.postMessage({
      command: 'webviewLoaded',
    });
    VSCode.postMessage({
      command: 'checkAuth',
    });

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
}
