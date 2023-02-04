import {
  ensureRepInCourse,
  ensureStaffMemberOfCourse,
  ensureStudentOfCourse,
} from '../utils/roles';
import { ensureAuth, ensureVerified } from '../utils/user';
import type { CourseResolvers } from '../__generated__/graphql';
import { CourseMemberEnum } from '../__generated__/graphql';

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
};

export default resolver;
