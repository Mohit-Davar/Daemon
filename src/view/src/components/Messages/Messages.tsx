import { useEffect, useRef } from 'react';

import { useChatStore } from '@/store/store';
import type { Message } from '@/store/type';

import { AIMessage } from './AI';
import { UserMessage } from './User';

export function MessageList() {
  const messages = useChatStore((state) => state.messages);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageLength = messages[messages.length - 1]?.text.length;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }

  }, [messages, lastMessageLength]);

  return (
    <div
      ref={chatContainerRef}
      className="space-y-4 p-3 w-full overflow-y-auto"
    >
      {messages.map((msg: Message, index: number) => {
        if (msg.sender === 'ai') {
          return <AIMessage key={index} msg={msg} />;
        }
        return <UserMessage key={index} msg={msg} />;
      })}
    </div>
  );
}