import { Toast } from '@/components/ui/toast';
import { LoginScreen } from '@/features/auth/components/login-screen';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { ChatInput } from '@/features/chat/components/chat-input';
import { MessageList } from '@/features/chat/components/message-list';
import { HistoryList } from '@/features/history/components/history-list';
import { useMessageHandler } from '@/hooks/use-message-handler';

export default function App() {
  const { user } = useAuthStore();

  useMessageHandler();

  if (!user) return <LoginScreen />;

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col bg-editor select-none">
      <Toast />
      <HistoryList />
      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex-1">
          <MessageList />
        </div>
        <div className="shrink-0">
          <ChatInput />
        </div>
      </main>
    </div>
  );
}
