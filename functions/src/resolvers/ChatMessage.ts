import type { ChatMessageResolvers } from '../__generated__/graphql';

// Resolvers for the Course Chat type
const resolver: ChatMessageResolvers = {
  id: async ({ _messageId }) => _messageId,

  sender: async (
    { _courseId, _chatId, _messageId },
    _,
    { dataLoaders: { chatMessages } }
  ) => ({
    _uid: (await chatMessages.fetchDocById(_courseId, _chatId, _messageId))!
      .sender,
  }),

  message: async (
    { _courseId, _chatId, _messageId },
    _,
    { dataLoaders: { chatMessages } }
  ) =>
    (await chatMessages.fetchDocById(_courseId, _chatId, _messageId))!.message,

  createdAt: async (
    { _courseId, _chatId, _messageId },
    _,
    { dataLoaders: { chatMessages } }
  ) =>
    (await chatMessages.fetchDocById(
      _courseId,
      _chatId,
      _messageId
    ))!.createdAt.toString(),
};

export default resolver;
