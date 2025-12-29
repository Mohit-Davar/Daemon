import { History } from '@/components/History/History';
import { ChatInput } from '@/components/Input/Input';
import { MessageList } from '@/components/Messages/Messages';
import { useMessageHandler } from '@/hooks/useMessageHandler';

export default function App() {
  useMessageHandler();

  return (
    <div className="w-full h-screen overflow-hidden">
      <History />
      <main className="flex flex-col h-full">
        <MessageList />
        <ChatInput />
      </main>
    </div>
  );
}
