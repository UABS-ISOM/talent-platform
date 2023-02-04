import type {
  CourseProjectResolvers,
  CourseProjectStatusEnum,
} from '../__generated__/graphql';

// Resolvers for the Course Chat type
const resolver: CourseProjectResolvers = {
  id: async ({ _projectId }) => _projectId,

  name: async (
    { _courseId, _projectId },
    _,
    { dataLoaders: { courseProjects } }
  ) => (await courseProjects.fetchDocById(_courseId, _projectId))!.name,

  overview: async (
    { _courseId, _projectId },
    _,
    { dataLoaders: { courseProjects } }
  ) =>
    (await courseProjects.fetchDocById(_courseId, _projectId))?.overview ?? '',

  status: async (
    { _courseId, _projectId },
    _,
    { dataLoaders: { courseProjects } }
  ) =>
    (await courseProjects.fetchDocById(_courseId, _projectId))!
      .status as CourseProjectStatusEnum,
};

export default resolver;
