import { getFirestore } from 'firebase-admin/firestore';
import { GenericConverter } from '../dataSources/generics';
import type { CourseDoc, CourseAdminDoc } from '../dataSources/models';
import type { UserResolvers } from '../__generated__/graphql';
import { Role } from '../__generated__/graphql';

// Resolvers for the User type
const resolver: UserResolvers = {
  // Resolve information from the user's Firebase Auth record
  id: async ({ _uid }) => _uid,

  name: async ({ _getUserRecord }) =>
    (await _getUserRecord()).displayName ?? 'Unnamed User',

  email: async ({ _getUserRecord }) => (await _getUserRecord()).email ?? '',

  photoUrl: async ({ _getUserRecord }) => {
    const { photoURL, displayName } = await _getUserRecord();
    return photoURL !== undefined && photoURL !== ''
      ? photoURL
      : `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(
          displayName ?? 'Unnamed User'
        )}`;
  },

  roles: async ({ _getUserRecord }) => {
    const { emailVerified, email } = await _getUserRecord();
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
  courses: async ({ _uid }) => {
    // TODO: Rewrite when data-loader-firestore has support for collection groups
    // Get courseAdmin documents for the user
    const coursesSnap = await getFirestore()
      .collectionGroup('courseAdmins')
      .withConverter(new GenericConverter<CourseAdminDoc>())
      .where('userId', '==', _uid)
      .get();

    // Get the course documents for the courses the user is an admin of
    const courseIds = coursesSnap.docs
      .map(
        doc =>
          doc.ref.parent.parent?.withConverter(
            new GenericConverter<CourseDoc>()
          ).id
      )
      .filter((id): id is string => id !== undefined);

    return courseIds.map(id => ({
      _id: id,
      _courseStaffQuery: ref => ref,
    }));
  },
};

export default resolver;
