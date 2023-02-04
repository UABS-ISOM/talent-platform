import type { UserResolvers } from '../__generated__/graphql';
import { Role } from '../__generated__/graphql';

// Resolvers for the User type
const resolver: UserResolvers = {
  // Resolve information from the user's Firebase Auth record
  id: async ({ _uid }) => _uid,

  name: async ({ _uid }, _, { dataLoaders: { userRecords } }) =>
    (await userRecords.load(_uid)).displayName ?? 'Unnamed User',

  email: async ({ _uid }, _, { dataLoaders: { userRecords } }) =>
    (await userRecords.load(_uid)).email ?? '',

  photoUrl: async ({ _uid }, _, { dataLoaders: { userRecords } }) => {
    const { photoURL, displayName } = await userRecords.load(_uid);
    return photoURL !== undefined && photoURL !== ''
      ? photoURL
      : `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(
          displayName ?? 'Unnamed User'
        )}`;
  },

  roles: async ({ _uid }, _, { dataLoaders: { userRecords } }) => {
    const { emailVerified, email } = await userRecords.load(_uid);
    return emailVerified && email !== undefined
      ? email?.endsWith('auckland.ac.nz')
        ? [Role.Staff]
        : [Role.Student]
      : [];
  },

  // Resolve information from the user's Firestore document
  pronouns: async ({ _uid }, __, { dataLoaders: { users } }) =>
    (await users.fetchDocById(_uid))?.pronouns ?? null,

  overview: async ({ _uid }, __, { dataLoaders: { users } }) =>
    (await users.fetchDocById(_uid))?.overview ?? '',

  skills: async ({ _uid }, __, { dataLoaders: { users } }) =>
    (await users.fetchDocById(_uid))?.skills ?? [],

  // Send a model of the user's experiences to the UserExperience resolver
  experience: async ({ _uid }, _, { dataLoaders: { userExperiences } }) =>
    await (
      await userExperiences.fetchDocsByQuery(c => c.where('userId', '==', _uid))
    ).map(doc => ({ _id: doc._id })),

  // Send a model of the user's courses to the Course resolver
  adminCourses: async ({ _uid }, _, { dataLoaders: { courseAdmins } }) => {
    // Get courseAdmin documents for the user
    const courseAdminDocs = await courseAdmins.fetchDocsByCollectionGroupQuery(
      c => c.where('userId', '==', _uid)
    );

    return courseAdminDocs.map(({ _path }) => ({
      _id: _path?.split('/')[1] ?? '', // Get the course ID from the document path
      _courseStudentsQuery: ref => ref,
      _courseStaffQuery: ref => ref,
      _courseRepsQuery: ref => ref,
    }));
  },

  // Send a model of the user's courses to the Course resolver
  studentCourses: async ({ _uid }, _, { dataLoaders: { courseStudents } }) => {
    // Get courseAdmin documents for the user
    const courseStudentDocs =
      await courseStudents.fetchDocsByCollectionGroupQuery(c =>
        c.where('userId', '==', _uid)
      );

    return courseStudentDocs.map(({ _path }) => ({
      _id: _path?.split('/')[1] ?? '', // Get the course ID from the document path
      _courseStudentsQuery: ref => ref,
      _courseStaffQuery: ref => ref,
      _courseRepsQuery: ref => ref,
    }));
  },

  // Send a model of the user's courses to the Course resolver
  repCourses: async ({ _uid }, _, { dataLoaders: { courseReps } }) => {
    // Get courseAdmin documents for the user
    const courseRepDocs = await courseReps.fetchDocsByCollectionGroupQuery(c =>
      c.where('userId', '==', _uid)
    );

    return courseRepDocs.map(({ _path }) => ({
      _id: _path?.split('/')[1] ?? '', // Get the course ID from the document path
      _courseStudentsQuery: ref => ref,
      _courseStaffQuery: ref => ref,
      _courseRepsQuery: ref => ref,
    }));
  },
};

export default resolver;
