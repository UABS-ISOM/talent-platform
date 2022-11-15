import { Role, UserResolvers } from '../__generated__/graphql';

// Resolvers for the User type
const resolver: UserResolvers = {
  // Resolve information from the user's Firebase Auth record
  id: parent => parent._userRecord.uid,
  name: parent => parent._userRecord.displayName ?? 'Unnamed User',
  email: parent => parent._userRecord.email ?? '',
  photoUrl: parent =>
    parent._userRecord.photoURL ??
    `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(
      parent._userRecord.displayName ?? 'Unnamed User'
    )}`,
  roles: parent =>
    parent._userRecord.emailVerified && parent._userRecord.email !== undefined
      ? parent._userRecord.email?.endsWith('auckland.ac.nz')
        ? [Role.Staff]
        : [Role.Student]
      : [],

  // Resolve information from the user's Firestore document
  pronouns: parent => parent._userDoc.pronouns ?? null,
  overview: parent => parent._userDoc.overview ?? '',
  skills: parent => parent._userDoc.skills ?? [],

  // Send a model of the user's experiences to the UserExperience resolver
  experience: async (parent, _, { collections }) => {
    // Get all the user's experience from the userExperiences collection
    const experienceQuery = collections.userExperiences.where(
      'userId',
      '==',
      parent._userRecord.uid
    );
    const experienceDocs = await experienceQuery.get();

    return experienceDocs.docs.map(doc => ({
      _id: doc.id,
      _userExperienceDoc: doc.data(),
    }));
  },

  // Send a model of the user's courses to the Course resolver
  courses: () => [],
};

export default resolver;
