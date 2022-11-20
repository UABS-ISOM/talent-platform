import { GraphQLError } from 'graphql';

// A custom GraphQLError for when data cannot be fetched.
export const dataFetchError = () =>
  new GraphQLError('Could not fetch your data.', {
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
    },
  });

// A custom GraphQLError for when a user is forbidden
export const forbiddenError = () => {
  new GraphQLError('You do not have access to this.', {
    extensions: {
      code: 'FORBIDDEN',
    },
  });
};
