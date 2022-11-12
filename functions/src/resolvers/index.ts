import { Resolvers } from '../__generated__/graphql';
import { getAuth } from 'firebase-admin/auth';
import { ensureAuth, ensureStaff, ensureVerified } from '../utils/user';
import User from './User';
import Course from './Course';
import { dataFetchError } from '../utils/errors';

const resolvers: Resolvers = {
  Query: {
    // Send a model of the current user to the User resolver
    async me(parent, args, { user }) {
      // Return null if the user is not authenticated
      try {
        user = ensureAuth(user);
      } catch (e) {
        return null;
      }

      return { _userModel: await getAuth().getUser(user.uid) };
    },
  },

  Mutation: {
    // Add a new course to the database
    async addCourse(parent, { name, description }, { user, collections }) {
      // Ensure the user is staff
      user = ensureAuth(user); // TODO: What if user token providd is incorrect/doesn't exist?
      ensureVerified(user);
      ensureStaff(user);

      const courseRef = await collections.courses.add({ name, description });
      const courseData = (await courseRef.get()).data();

      if (courseData === undefined) throw dataFetchError();

      // Send the new course to the Course resolver
      return { _id: courseRef.id, _courseModel: courseData };
    },
  },

  User,
  Course,
};

export default resolvers;
