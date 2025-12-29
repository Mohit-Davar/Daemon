import { HistoryList } from '@/features/history/components/history-list';
import { ChatInput } from '@/features/chat/components/chat-input';
import { MessageList } from '@/features/chat/components/message-list';
import { useMessageHandler } from '@/features/chat/hooks/use-message-handler';

export default function App() {
  useMessageHandler();

  return (
    <div className="w-full h-screen overflow-hidden">
      <HistoryList />
      <main className="flex flex-col h-full">
        <MessageList />
        <ChatInput />
      </main>
    </div>
  );
}
