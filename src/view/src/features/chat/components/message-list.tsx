import ScrollToBottom, { useScrollToBottom, useSticky } from 'react-scroll-to-bottom';
import { useChatStore } from '@/features/chat/store/chat-store';
import { MessageItem } from '@/features/chat/components/message-item';
import { WelcomeScreen } from '@/features/chat/components/welcome-screen';
import { ScrollToBottomButton } from '@/features/chat/components/scroll-button';

export function MessageList() {
  const convos = useChatStore((state) => state.convos);
  const activeID = useChatStore((state) => state.activeID);

  const activeConvo = convos.find((c) => c.id === activeID);
  const messages = activeConvo ? activeConvo.messages : [];

  const scrollToBottom = useScrollToBottom();
  const [sticky] = useSticky();

  if (!activeID || !messages.length) {
    return <WelcomeScreen />;
  }

  return (
    <div className="relative flex-1 overflow-y-hidden">
      <ScrollToBottom
        key={activeID}
        className="w-full h-full"
        scrollViewClassName="flex flex-col gap-6 p-4 w-full overflow-y-auto scroll-smooth"
        initialScrollBehavior="auto"
        followButtonClassName="hidden"
      >
        <div className="flex flex-col gap-6 mx-auto pb-4 w-full max-w-4xl">
          {messages.map((msg) => (
            <MessageItem key={msg.id} msg={msg} />
          ))}
        </div>
      </ScrollToBottom>

      <ScrollToBottomButton onClick={() => scrollToBottom({ behavior: 'smooth' })} show={!sticky} />
    </div>
  );
}
