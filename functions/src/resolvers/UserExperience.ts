import { UserExperienceResolvers } from '../__generated__/graphql';

// Resolvers for the Course type
const resolver: UserExperienceResolvers = {
  // Resolve information from the user experience Firestore document
  id: parent => parent._id,
  title: parent => parent._userExperienceDoc.title,
  company: parent => parent._userExperienceDoc.company,
  location: parent => parent._userExperienceDoc.location,
  startDate: parent => parent._userExperienceDoc.startDate,
  endDate: parent => parent._userExperienceDoc.endDate ?? null,
  description: parent => parent._userExperienceDoc.description,
};

export default resolver;
