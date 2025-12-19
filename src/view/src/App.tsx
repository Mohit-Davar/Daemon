import { ChatInput } from '@/components/Input/Input';
import { MessageList } from '@/components/Messages/Messages';

export default function App() {
  return (
    <main className="flex flex-col justify-end h-screen">
      <MessageList />
      <ChatInput />
    </main>
  );
}
