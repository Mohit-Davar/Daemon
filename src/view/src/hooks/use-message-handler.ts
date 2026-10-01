import { useEffect } from 'react';

import { useAuthStore } from '@/features/auth/store/auth-store';
import { useChatStore } from '@/features/chat/store/chat-store';
import { VSCode } from '@/lib/vscode';
import { useUIStore } from '@/store/ui-store';
import type { ActiveFileContext } from '@/types';

export function useMessageHandler() {
  useEffect(() => {
    const handleMessage = ({ data }: MessageEvent) => {
      const chatStore = useChatStore.getState();
      const uiStore = useUIStore.getState();
      const authStore = useAuthStore.getState();

      switch (data.command) {
        case 'stream': {
          chatStore.appendToken(data.text);
          return;
        }

        case 'streamDone': {
          uiStore.toggleLoading();
          return;
        }

        case 'addChat': {
          const id = chatStore.createConvo();
          chatStore.setActiveConvo(id);
          return;
        }

        case 'toggleHistory': {
          uiStore.toggleHistory();
          chatStore.setConvos(data.data);
          return;
        }

        case 'hydrate': {
          chatStore.setConvos(data.data);
          const activeId = data.data.length > 0 ? data.data[0].id : chatStore.createConvo();
          chatStore.setActiveConvo(activeId);
          return;
        }

        case 'authSuccess': {
          authStore.setUser(data.data);
          return;
        }

        case 'error': {
          uiStore.setError(data.text);
          return;
        }

        case 'setContext': {
          uiStore.setActiveFile(data.data as ActiveFileContext);
          return;
        }

        case 'convoDeleted': {
          // Extension has already deleted and echoed back — activeID was updated in the store
          // when the user clicked, so nothing more to do here unless needed
          return;
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Signal backend that we are ready
    VSCode.postMessage({ command: 'webviewLoaded' });
    VSCode.postMessage({ command: 'checkAuth' });

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
}
