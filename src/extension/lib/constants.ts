export const CONSTANTS = {
  VIEW_ID: 'daemonView',
  COMMANDS: {
    NEW_CONVERSATION: 'daemon.newConversation',
    CHAT_HISTORY: 'daemon.chatHistory',
    LOGOUT: 'daemon.logout',
  },
  STORAGE: {
    CONVOS: 'convos',
    LOGGED_OUT: 'loggedOut',
  },
} as const;
