import { Resolvers } from '../__generated__/graphql';
import { getAuth } from 'firebase-admin/auth';
import { ensureAuth, ensureStaff, ensureVerified } from '../utils/user';
import User from './User';
import UserExperience from './UserExperience';
import Course from './Course';
import { dataFetchError } from '../utils/errors';
import { DateResolver } from 'graphql-scalars';
import escapeHTML from 'escape-html';
import sanitizeHtml from 'sanitize-html';

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
    // Generate custom Auth claims for the user
    async generateClaims(_, __, { user }) {
      // Ensure the user is authenticated
      user = ensureAuth(user);
      ensureVerified(user);

      // Set claims
      const claim = { staff: user.email?.endsWith('@auckland.ac.nz') === true };
      await getAuth().setCustomUserClaims(user.uid, claim);

      return claim;
    },

    // Add a new course to the database
    async addCourse(_, { name, description }, { user, collections }) {
      // Ensure the user is staff
      user = ensureAuth(user); // TODO: What if user token provided is incorrect/doesn't exist?
      ensureVerified(user);
      ensureStaff(user);

      const courseRef = await collections.courses.add({
        name: escapeHTML(name),
        description: escapeHTML(description),
      });
      const courseData = (await courseRef.get()).data();

      if (courseData === undefined) throw dataFetchError();

      // Send the new course to the Course resolver
      return { _id: courseRef.id, _courseDoc: courseData };
    },

    // Edit the current user's details
    async editMe(_, { input }, { user, collections }) {
      // Ensure the user is authenticated
      user = ensureAuth(user);
      ensureVerified(user);

      // Update the user's Auth record
      await getAuth().updateUser(user.uid, {
        ...(typeof input.name === 'string' && input.name.length > 0
          ? { displayName: escapeHTML(input.name) }
          : {}),
      });

      // Update the user's Firestore document
      const userRef = await collections.users.doc(user.uid);
      if (input.overview !== null || input.skills !== null)
        await userRef.set(
          {
            ...(typeof input.pronouns === 'string'
              ? { pronouns: escapeHTML(input.pronouns) }
              : {}),
            ...(typeof input.overview === 'string'
              ? { overview: sanitizeHtml(input.overview) }
              : {}),
            ...(Array.isArray(input.skills)
              ? {
                  skills: input.skills
                    .map(skill => escapeHTML(skill))
                    .filter(skill => skill !== ''),
                }
              : {}),
          },
          { merge: true }
        );

      // Send the updated user to the User resolver
      return {
        _userRecord: await getAuth().getUser(user.uid),
        _userDoc: (await userRef.get()).data() ?? {},
      };
    },
  },

  User,
  UserExperience,
  Course,
  Date: DateResolver,
};

export default resolvers;
