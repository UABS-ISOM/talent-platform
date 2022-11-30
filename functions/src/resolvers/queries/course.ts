import { ensureAuth, ensureVerified } from '../../utils/user';
import type { QueryResolvers } from '../../__generated__/graphql';
import type { CourseAdminDoc } from '../../dataSources/models';
import { forbiddenError } from '../../utils/errors';
import type { CollectionReference, Query } from 'firebase-admin/firestore';
import { typedCollection } from '../../dataSources/generics';
import type { OutputDocumentData } from 'data-loader-firestore';
import type { CourseAdminModel } from '../../dataLoaders/models';

// Send a model of the course to the Course resolver
export const course: QueryResolvers['course'] = async (
  _,
  { courseId, courseStaffOptions },
  { user, dataLoaders }
) => {
  // Return null if the user is not authenticated
  user = ensureAuth(user);
  ensureVerified(user);

  // Return null if the course does not exist
  if ((await dataLoaders.courses.fetchDocById(courseId)) === undefined)
    return null;

  // Determine if the user is an admin of the course
  if (
    (await dataLoaders.courseAdmins.fetchDocById(courseId, user.uid)) ===
    undefined
  )
    throw forbiddenError();

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
};
