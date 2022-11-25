import type { QueryResolvers } from '../__generated__/graphql';
import { getAuth } from 'firebase-admin/auth';
import { ensureAuth, ensureVerified } from '../utils/user';
import type { CourseAdminDoc } from '../dataSources/models';
import type { UserRecord } from 'firebase-functions/v1/auth';
import { forbiddenError } from '../utils/errors';
import type { CollectionReference, Query } from 'firebase-admin/firestore';
import { typedCollection } from '../dataSources/generics';
import type { OutputDocumentData } from 'data-loader-firestore';
import type { CourseAdminModel } from '../dataLoaders/models';

/**
 * Allow Type resolvers to get the user's Firebase Auth record.
 * @param uid The user's UID.
 * @returns _getUserRecord
 */
export const createUserRecordGetter = (
  uid: string
): (() => Promise<UserRecord>) => {
  // TODO: Cache userRecord with a DataSource
  let userRecord: UserRecord | undefined;

  return async (): Promise<UserRecord> => {
    if (userRecord === undefined) userRecord = await getAuth().getUser(uid);
    return userRecord;
  };
};

// Resolvers for the Course type
const resolver: QueryResolvers = {
  // Send a model of the current user to the User resolver
  async me(_, __, { user }) {
    // Return null if the user is not authenticated
    user = ensureAuth(user);

    return {
      _uid: user.uid,
      _getUserRecord: createUserRecordGetter(user.uid),
    };
  },

  // Send a model of the course to the Course resolver
  async course(_, { courseId, courseStaffOptions }, { user, dataLoaders }) {
    // Return null if the user is not authenticated
    user = ensureAuth(user);
    ensureVerified(user);

    // Return null if the course does not exist
    const course = await dataLoaders.courses.fetchDocById(courseId);
    if (course === undefined) return null;

    // Determine if the user is an admin of the course
    const courseAdmin = await dataLoaders.courseAdmins.fetchDocById(
      courseId,
      user.uid
    );
    if (courseAdmin === undefined) throw forbiddenError();

    // Determine the query used to get the course staff
    let courseStaffQuery:
      | ((
          ref: CollectionReference<OutputDocumentData<CourseAdminModel>>
        ) => Query)
      | undefined = undefined;

    if (courseStaffOptions) {
      // Find starting document for the query
      const startIndex =
        (courseStaffOptions.page - 1) * courseStaffOptions.rowsPerPage;

      let startId: string | undefined;
      if (startIndex > 0) {
        // Get the userId of the document at the start index
        const first = await typedCollection<CourseAdminDoc>(
          'courses',
          courseId,
          'courseAdmins'
        )
          .orderBy('userId')
          .limit(startIndex)
          .get();

        if (first.docs.length > 0) {
          // Found a document to start the query from
          startId = first.docs[first.docs.length - 1].data().userId;

          courseStaffQuery = ref =>
            ref
              .orderBy('userId')
              .startAfter(startId)
              .limit(courseStaffOptions.rowsPerPage);
        }
      }
    }

    // Otherwise fall back to the default query
    if (courseStaffQuery === undefined)
      courseStaffQuery = ref =>
        courseStaffOptions && courseStaffOptions.rowsPerPage > 0
          ? ref.orderBy('userId').limit(courseStaffOptions.rowsPerPage)
          : ref.orderBy('userId');

    return {
      _id: courseId,
      _courseStaffQuery: courseStaffQuery,
    };
  },
};

export default resolver;
