import algoliasearch from 'algoliasearch/lite';
import type {
  FirestoreCollectionLoader,
  OutputDocumentData,
} from 'data-loader-firestore';
import type { UserModel } from '../dataLoaders/models';

const searchClient = algoliasearch(
  process.env.ALGOLIA_ID,
  process.env.ALGOLIA_SEARCH_KEY
);

const usersSearchIndex = searchClient.initIndex(
  process.env.FUNCTIONS_EMULATOR === 'true'
    ? process.env.DEV_ALGOLIA_USERS_INDEX
    : process.env.ALGOLIA_USERS_INDEX
);

/**
 * Search for users in the Algolia users index.
 * @param query The query string to search for.
 * @param usersDataLoader The data loader for the users collection.
 * @returns An array of users matching the query.
 */
export const searchUsers = async (
  query: string,
  courseId: string,
  usersDataLoader: FirestoreCollectionLoader<UserModel>
): Promise<OutputDocumentData<UserModel>[]> => {
  return (
    await usersSearchIndex.search<UserModel>(query, {
      filters: `studentCourses:${courseId}`,
    })
  ).hits.map(hit => {
    const data = {
      _id: hit.objectID,
      _path: `users/${hit.objectID}`,
      displayName: hit.displayName,
      pronouns: hit.pronouns,
      overview: hit.overview,
      skills: hit.skills,
    };

    usersDataLoader.dataLoader.prime(data._path, data);
    return data;
  });
};
