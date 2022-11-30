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
  courses: async ({ _uid }, _, { dataLoaders: { courseAdmins } }) => {
    // Get courseAdmin documents for the user
    const courseAdminDocs = await courseAdmins.fetchDocsByCollectionGroupQuery(
      c => c.where('userId', '==', _uid)
    );

    return courseAdminDocs.map(({ _path }) => ({
      _id: _path?.split('/')[1] ?? '', // Get the course ID from the document path
      _courseStaffQuery: ref => ref,
    }));
  },
};

export default resolver;
