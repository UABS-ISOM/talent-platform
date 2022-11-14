import { Resolvers } from '../__generated__/graphql';
import { getAuth } from 'firebase-admin/auth';
import { ensureAuth, ensureStaff, ensureVerified } from '../utils/user';
import User from './User';
import UserExperience from './UserExperience';
import Course from './Course';
import { dataFetchError } from '../utils/errors';
import { DateResolver } from 'graphql-scalars';

const resolvers: Resolvers = {
  Query: {
    // Send a model of the current user to the User resolver
    async me(_, __, { user, collections }) {
      // Return null if the user is not authenticated
      try {
        user = ensureAuth(user);
      } catch (e) {
        return null;
      }

      const userRef = await collections.users.doc(user.uid);
      const userData = (await userRef.get()).data() ?? {};

      return {
        _userRecord: await getAuth().getUser(user.uid),
        _userDoc: userData,
      };
    },
  },

  Mutation: {
    // Add a new course to the database
    async addCourse(_, { name, description }, { user, collections }) {
      // Ensure the user is staff
      user = ensureAuth(user); // TODO: What if user token providd is incorrect/doesn't exist?
      ensureVerified(user);
      ensureStaff(user);

      const courseRef = await collections.courses.add({ name, description });
      const courseData = (await courseRef.get()).data();

      if (courseData === undefined) throw dataFetchError();

      // Send the new course to the Course resolver
      return { _id: courseRef.id, _courseDoc: courseData };
    },
  },

  User,
  UserExperience,
  Course,
  Date: DateResolver,
};

export default resolvers;
