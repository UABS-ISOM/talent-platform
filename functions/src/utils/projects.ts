import type { FirestoreCollectionLoader } from 'data-loader-firestore';
import { GraphQLError } from 'graphql';
import type { CourseProjectModel } from '../dataLoaders/models';

/**
 * Throws an error if the chat does not exist.
 * @param courseId The course ID.
 * @param chatId The chat ID.
 * @param courseProjects The courses chats data loader.
 */
export const ensureCourseProjectExists = async (
  courseId: string,
  projectId: string,
  courseProjects: FirestoreCollectionLoader<CourseProjectModel>
): Promise<void> => {
  if ((await courseProjects.fetchDocById(courseId, projectId)) === undefined)
    throw new GraphQLError('This project does not exist.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
};

/**
 * Throws an error if the user is not the rep that owns the given project.
 * @param  The course ID.
 * @param uid The user's ID.courseId
 * @param courseProjects The course reps data loader.
 */
export const ensureRepOwnsProject = async (
  courseId: string,
  projectId: string,
  uid: string,
  courseProjects: FirestoreCollectionLoader<CourseProjectModel>
): Promise<void> => {
  // Determine if the user owns the project
  const project = await courseProjects.fetchDocById(courseId, projectId);
  if (project === undefined || project.userId !== uid)
    throw new GraphQLError('You do not own this project.', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
};
