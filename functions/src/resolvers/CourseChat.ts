import type { CourseChatResolvers } from '../__generated__/graphql';

// Resolvers for the Course Chat type
const resolver: CourseChatResolvers = {
  id: async ({ _chatId }) => _chatId,

  name: async (
    { _courseId, _chatId },
    __,
    { user, dataLoaders: { users, courseChats } }
  ) => {
    const { name, personal, userIds } = (await courseChats.fetchDocById(
      _courseId,
      _chatId
    ))!;

    if (name) return name;

    const chatUsers = await Promise.all(
      userIds
        .filter(uid => uid !== user?.uid)
        .map(uid => users.fetchDocById(uid))
    );
    const userNames = chatUsers
      .map(user => user?.displayName ?? 'Unnamed User')
      .join(', ');

    return `${personal ? 'Chat with' : 'Group chat with'} ${
      userNames ? userNames : 'nobody'
    }`;
  },

  personal: async (
    { _courseId, _chatId },
    __,
    { dataLoaders: { courseChats } }
  ) => (await courseChats.fetchDocById(_courseId, _chatId))!.personal!,

  users: async ({ _courseId, _chatId }, __, { dataLoaders: { courseChats } }) =>
    ((await courseChats.fetchDocById(_courseId, _chatId))?.userIds ?? []).map(
      id => ({
        _courseId,
        _studentId: id,
      })
    ),
};

export default resolver;
