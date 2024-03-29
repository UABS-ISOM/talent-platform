import { ensureStudentHasGroup } from '../utils/groups';
import { ensureAuth, ensureVerified } from '../utils/user';
import { CourseProjectBidStatusEnum } from '../__generated__/graphql';
import type {
  CourseProjectResolvers,
  CourseProjectStatusEnum,
} from '../__generated__/graphql';
import { dataFetchError } from '../utils/errors';
import { ensureRepOwnsProject } from '../utils/projects';

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

  owner: async (
    { _courseId, _projectId },
    _,
    { dataLoaders: { courseProjects } }
  ) => ({
    _uid: (await courseProjects.fetchDocById(_courseId, _projectId))!.userId,
  }),

  groupProject: async (
    { _courseId, _projectId },
    _,
    { user, dataLoaders: { courseStudents, courseGroupProjects } }
  ) => {
    user = ensureAuth(user);
    let groupId: string;
    try {
      groupId = await ensureStudentHasGroup(
        _courseId,
        user.uid,
        courseStudents
      );
    } catch (e) {
      return null;
    }

    let [groupProject] = await courseGroupProjects.fetchDocsByQuery(
      c =>
        c.where('groupId', '==', groupId).where('projectId', '==', _projectId),
      _courseId
    );

    // Create the group project if it doesn't exist
    if (groupProject === undefined) {
      const newGroupProject = await courseGroupProjects.createDoc(
        {
          groupId,
          projectId: _projectId,
          starred: false,
          bid: '',
          bidStatus: CourseProjectBidStatusEnum.Draft,
        },
        true,
        _courseId
      );

      if (newGroupProject === undefined) {
        throw dataFetchError();
      } else groupProject = newGroupProject;
    }

    return groupProject
      ? {
          _courseId,
          _groupProjectId: groupProject?._id,
        }
      : null;
  },

  approvedBids: async (
    { _courseId, _projectId },
    _,
    { user, dataLoaders: { courseProjects, courseGroupProjects } }
  ) => {
    // Ensure the user is a rep
    user = ensureAuth(user);
    ensureVerified(user);
    await ensureRepOwnsProject(_courseId, _projectId, user.uid, courseProjects);

    return (
      await courseGroupProjects.fetchDocsByQuery(
        c => c.where('bidStatus', '==', CourseProjectBidStatusEnum.PendingRep),
        _courseId
      )
    ).map(g => ({ _courseId: _courseId, _groupProjectId: g._id }));
  },
};

export default resolver;
