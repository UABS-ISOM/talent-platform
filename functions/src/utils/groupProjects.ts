import type { FirestoreCollectionLoader } from 'data-loader-firestore';
import { GraphQLError } from 'graphql';
import type { CourseGroupProjectModel } from '../dataLoaders/models';

/**
 * Throws an error if the chat does not exist.
 * @param courseId The course ID.
 * @param chatId The chat ID.
 * @param courseProjects The courses chats data loader.
 */
export const ensureGroupProjectExists = async (
  courseId: string,
  groupProjectId: string,
  groupProjects: FirestoreCollectionLoader<CourseGroupProjectModel>
): Promise<void> => {
  if (
    (await groupProjects.fetchDocById(courseId, groupProjectId)) === undefined
  )
    throw new GraphQLError('This group project does not exist.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
};
