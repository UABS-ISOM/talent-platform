import type { UserExperienceResolvers } from '../__generated__/graphql';

// Resolvers for the Course type
const resolver: UserExperienceResolvers = {
  // Resolve information from the user experience Firestore document
  id: parent => parent._id,
  title: async ({ _id }, __, { dataLoaders: { userExperiences } }) =>
    (await userExperiences.fetchDocById(_id))!.title,
  company: async ({ _id }, __, { dataLoaders: { userExperiences } }) =>
    (await userExperiences.fetchDocById(_id))!.company,
  location: async ({ _id }, __, { dataLoaders: { userExperiences } }) =>
    (await userExperiences.fetchDocById(_id))!.location,
  startDate: async ({ _id }, __, { dataLoaders: { userExperiences } }) =>
    (await userExperiences.fetchDocById(_id))!.startDate,
  endDate: async ({ _id }, __, { dataLoaders: { userExperiences } }) =>
    (await userExperiences.fetchDocById(_id))?.endDate ?? null,
  description: async ({ _id }, __, { dataLoaders: { userExperiences } }) =>
    (await userExperiences.fetchDocById(_id))!.description,
};

export default resolver;
