import { getFirestore } from 'firebase-admin/firestore';
import { GenericConverter } from '../dataSources/generics';
import type { CourseDoc, CourseAdminDoc } from '../dataSources/models';
import type { UserResolvers } from '../__generated__/graphql';
import { Role } from '../__generated__/graphql';

// Resolvers for the User type
const resolver: UserResolvers = {
  // Resolve information from the user's Firebase Auth record
  id: async ({ _getUserRecord }) => (await _getUserRecord()).uid,

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
  pronouns: async ({ _getUserDoc }) => {
    return (await _getUserDoc()).pronouns ?? null;
  },

  overview: async ({ _getUserDoc }) => {
    return (await _getUserDoc()).overview ?? '';
  },

  skills: async ({ _getUserDoc }) => {
    return (await _getUserDoc()).skills ?? [];
  },

  // Send a model of the user's experiences to the UserExperience resolver
  experience: async ({ _getUserRecord }, _, { dataSources }) => {
    // Get all the user's experience from the userExperiences collection
    const { uid } = await _getUserRecord();
    const experienceDocs = await dataSources.userExperiences.findManyByQuery(
      c => c.where('userId', '==', uid)
    );

    return experienceDocs.map(doc => ({
      _id: doc.id,
      _userExperienceDoc: doc.data(),
    }));
  },

  // Send a model of the user's courses to the Course resolver
  courses: async ({ _uid }) => {
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
      _courseId: id,
    }));
  },
};

export default resolver;
