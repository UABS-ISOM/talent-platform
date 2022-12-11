import type { CourseChatResolvers } from '../__generated__/graphql';

// Resolvers for the Course Chat type
const resolver: CourseChatResolvers = {
  id: async ({ _chatId }) => _chatId,

  users: async ({ _courseId, _chatId }, __, { dataLoaders: { courseChats } }) =>
    ((await courseChats.fetchDocById(_courseId, _chatId))?.userIds ?? []).map(
      id => ({
        _uid: id,
      })
    ),
};

export default resolver;
