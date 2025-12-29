export const CONSTANTS = {
  VIEW_ID: 'daemonView',
  COMMANDS: {
    NEW_CONVERSATION: 'daemon.newConversation',
    CHAT_HISTORY: 'daemon.chatHistory',
  },
  CONFIG: {
    SECTION: 'daemon',
    API_KEY: 'groq.apiKey',
  },
  STORAGE: {
    CONVOS: 'convos',
  },
} as const;
