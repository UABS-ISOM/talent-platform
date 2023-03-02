import type {
  CourseGroupProjectResolvers,
  CourseProjectBidStatusEnum,
} from '../__generated__/graphql';

// Resolvers for the Course Chat type
const resolver: CourseGroupProjectResolvers = {
  id: async ({ _groupProjectId }) => _groupProjectId,

  starred: async (
    { _courseId, _groupProjectId },
    _,
    { dataLoaders: { courseGroupProjects } }
  ) =>
    (await courseGroupProjects.fetchDocById(_courseId, _groupProjectId))!
      .starred,

  bid: async (
    { _courseId, _groupProjectId },
    _,
    { dataLoaders: { courseGroupProjects } }
  ) =>
    (await courseGroupProjects.fetchDocById(_courseId, _groupProjectId))!.bid,

  bidStatus: async (
    { _courseId, _groupProjectId },
    _,
    { dataLoaders: { courseGroupProjects } }
  ) =>
    (await courseGroupProjects.fetchDocById(_courseId, _groupProjectId))!
      .bidStatus as CourseProjectBidStatusEnum,

  project: async (
    { _courseId, _groupProjectId },
    _,
    { dataLoaders: { courseGroupProjects } }
  ) => ({
    _courseId,
    _projectId: (await courseGroupProjects.fetchDocById(
      _courseId,
      _groupProjectId
    ))!.projectId,
  }),

  group: async (
    { _courseId, _groupProjectId },
    _,
    { dataLoaders: { courseGroupProjects } }
  ) => ({
    _courseId,
    _chatId: (await courseGroupProjects.fetchDocById(
      _courseId,
      _groupProjectId
    ))!.groupId,
  }),
};

export default resolver;
