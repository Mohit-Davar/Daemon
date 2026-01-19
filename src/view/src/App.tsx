import { Auth } from '@/features/auth/components/auth';
import { LoginScreen } from '@/features/auth/components/login-screen';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { ChatInput } from '@/features/chat/components/chat-input';
import { MessageList } from '@/features/chat/components/message-list';
import { HistoryList } from '@/features/history/components/history-list';
import { useMessageHandler } from '@/hooks/use-message-handler';
import { Toast } from '@/components/ui/toast';

export default function App() {
  const { user } = useAuthStore();
  useMessageHandler();

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="w-full h-screen overflow-hidden flex animate-fade-in">
      <Toast />
      <HistoryList />
      <main className="flex-1 flex flex-col h-full bg-background">
        <header className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-[var(--bg-editor)]/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <h2 className="font-semibold text-sm tracking-tight">Daemon Chat</h2>
          </div>
          <Auth />
        </header>
        <div className="flex-1 overflow-hidden">
          <MessageList />
        </div>
        <ChatInput />
      </main>
    </div>
  );
}
