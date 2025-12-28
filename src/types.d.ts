interface Messages {
  text: string;
  sender: 'user' | 'ai';
}
interface Convos {
  id: string;
  title: string;
  messages: Messages[];
}

interface QueryMessage {
  command: string;
  data: {
    query: string;
    ID: string;
  };
}
