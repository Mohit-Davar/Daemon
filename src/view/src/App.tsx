import { useEffect, useState } from 'react';

import { ChatInput } from '@/features/chat/components/chat-input';
import { MessageList } from '@/features/chat/components/message-list';
import { useMessageHandler } from '@/features/chat/hooks/use-message-handler';
import { HistoryList } from '@/features/history/components/history-list';
import { VSCode } from '@/lib/vscode';
import type { User } from '@/types';

export default function App() {
  useMessageHandler();
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    VSCode.postMessage({ command: 'login' });
  };

  const handleLogout = () => {
    VSCode.postMessage({ command: 'logout' });
    setUser(null);
  };

  useEffect(() => {
    VSCode.postMessage({ command: 'checkAuth' });

    const handleAuth = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === 'authSuccess') {
        setUser(message.data);
      }
    };

    window.addEventListener('message', handleAuth);

    return () => {
      window.removeEventListener('message', handleAuth);
    };
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden">
      <HistoryList />
      <main className="flex flex-col h-full">
        <div className="flex justify-end p-2 items-center gap-2">
          {user ? (
            <>
              <img src={user.photo} alt={user.displayName} className="w-8 h-8 rounded-full" />
              <span>{user.displayName}</span>
              <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded text-white">
                Logout
              </button>
            </>
          ) : (
            <button onClick={handleLogin} className="bg-blue-500 px-4 py-2 rounded text-white">
              Sign in with GitHub
            </button>
          )}
        </div>
        <MessageList />
        <ChatInput />
      </main>
    </div>
  );
}
