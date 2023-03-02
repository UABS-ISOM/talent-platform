import { ensureStudentHasGroup } from '../utils/groups';
import {
  ensureMemberOfCourse,
  ensureRepInCourse,
  ensureStaffMemberOfCourse,
  ensureStudentOfCourse,
} from '../utils/roles';
import { ensureAuth, ensureVerified } from '../utils/user';
import type { CourseResolvers } from '../__generated__/graphql';
import {
  CourseProjectBidStatusEnum,
  CourseProjectStatusEnum,
  CourseMemberEnum,
} from '../__generated__/graphql';

// Resolvers for the Course type
const resolver: CourseResolvers = {
  id: parent => parent._id,

  name: async ({ _id }, _, { dataLoaders: { courses } }) =>
    (await courses.fetchDocById(_id))?.name ?? '',

  description: async ({ _id }, _, { dataLoaders: { courses } }) =>
    (await courses.fetchDocById(_id))?.description ?? '',

  numStaff: async ({ _id }, _, { dataLoaders: { courses } }) =>
    (await courses.fetchDocById(_id))!.numStaff,

  numStudents: async ({ _id }, _, { dataLoaders: { courses } }) =>
    (await courses.fetchDocById(_id))!.numStudents,

  numReps: async ({ _id }, _, { dataLoaders: { courses } }) =>
    (await courses.fetchDocById(_id))!.numReps,

  staff: async (
    { _id, _courseStaffQuery },
    _,
    { dataLoaders: { courseAdmins } }
  ) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (await courseAdmins.fetchDocsByQuery(_courseStaffQuery as any, _id)).map(
      admin => ({
        _uid: admin.userId,
      })
    ),

  students: async (
    { _id, _courseStudentsQuery },
    _,
    { dataLoaders: { courseStudents: cs } }
  ) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (await cs.fetchDocsByQuery(_courseStudentsQuery as any, _id)).map(
      student => ({
        _uid: student.userId,
      })
    ),

  reps: async ({ _id, _courseRepsQuery }, _, { dataLoaders: { courseReps } }) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (await courseReps.fetchDocsByQuery(_courseRepsQuery as any, _id)).map(
      rep => ({
        _uid: rep.userId,
      })
    ),

  groupChats: async ({ _id }, _, { user, dataLoaders: { courseChats } }) =>
    (
      await courseChats.fetchDocsByQuery(
        c =>
          c
            .where('userIds', 'array-contains', user?.uid)
            .where('personal', '==', false),
        _id
      )
    ).map(chat => ({
      _courseId: _id,
      _chatId: chat._id,
    })),

  myRole: async (
    { _id },
    _,
    { user, dataLoaders: { courseStudents, courseAdmins, courseReps } }
  ) => {
    const currentUser = ensureAuth(user);

    return ensureStudentOfCourse(_id, currentUser.uid, courseStudents)
      .then(() => {
        return CourseMemberEnum.Student;
      })
      .catch(async () => {
        await ensureStaffMemberOfCourse(_id, currentUser.uid, courseAdmins);
        return CourseMemberEnum.Staff;
      })
      .catch(async () => {
        await ensureRepInCourse(_id, currentUser.uid, courseReps);
        return CourseMemberEnum.Rep;
      });
  },

  myGroup: async ({ _id }, _, { user, dataLoaders: { courseStudents } }) => {
    user = ensureAuth(user);
    let groupId: string;
    try {
      groupId = await ensureStudentHasGroup(_id, user.uid, courseStudents);
    } catch (e) {
      return null;
    }

    return {
      _courseId: _id,
      _chatId: groupId,
    };
  },

  myProjects: async (
    { _id },
    _,
    { user, dataLoaders: { courseReps, courseProjects } }
  ) => {
    // Ensure the user is a rep
    user = ensureAuth(user);
    ensureVerified(user);
    ensureRepInCourse(_id, user.uid, courseReps);

    return (
      await courseProjects.fetchDocsByQuery(
        c => c.where('userId', '==', user?.uid),
        _id
      )
    ).map(p => ({ _courseId: _id, _projectId: p._id }));
  },

  pendingProjects: async (
    { _id },
    _,
    { user, dataLoaders: { courseAdmins, courseProjects } }
  ) => {
    // Ensure the user is a rep
    user = ensureAuth(user);
    ensureVerified(user);
    await ensureStaffMemberOfCourse(_id, user.uid, courseAdmins);

    return (
      await courseProjects.fetchDocsByQuery(
        c => c.where('status', '==', CourseProjectStatusEnum.Pending),
        _id
      )
    ).map(p => ({ _courseId: _id, _projectId: p._id }));
  },

  activeProjects: async (
    { _id },
    _,
    {
      user,
      dataLoaders: { courseAdmins, courseProjects, courseStudents, courseReps },
    }
  ) => {
    // Ensure the user is a rep
    user = ensureAuth(user);
    ensureVerified(user);
    await ensureMemberOfCourse(
      _id,
      user.uid,
      courseAdmins,
      courseStudents,
      courseReps
    );

    return (
      await courseProjects.fetchDocsByQuery(
        c => c.where('status', '==', CourseProjectStatusEnum.Active),
        _id
      )
    ).map(p => ({ _courseId: _id, _projectId: p._id }));
  },

  pendingBids: async (
    { _id },
    _,
    { user, dataLoaders: { courseAdmins, courseGroupProjects } }
  ) => {
    // Ensure the user is a rep
    user = ensureAuth(user);
    ensureVerified(user);
    await ensureStaffMemberOfCourse(_id, user.uid, courseAdmins);

    return (
      await courseGroupProjects.fetchDocsByQuery(
        c => c.where('bidStatus', '==', CourseProjectBidStatusEnum.Pending),
        _id
      )
    ).map(g => ({ _courseId: _id, _groupProjectId: g._id }));
  },
};

export default resolver;
