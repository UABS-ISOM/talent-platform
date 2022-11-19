import type { UserDoc, UserExperienceDoc, CourseDoc } from './models';
import { typedCollection } from './generics';
import { FirestoreDataSource } from 'apollo-datasource-firestore';

/**
 * Type of the available data sources
 *
 * @export
 * @typedef {DataSources}
 */
export type DataSources = {
  users: FirestoreDataSource<UserDoc, unknown>;
  userExperiences: FirestoreDataSource<UserExperienceDoc, unknown>;
  courses: FirestoreDataSource<CourseDoc, unknown>;
};

const dataSources = (): DataSources => ({
  users: new FirestoreDataSource<UserDoc, unknown>(
    typedCollection<UserDoc>('users')
  ),
  userExperiences: new FirestoreDataSource<UserExperienceDoc, unknown>(
    typedCollection<UserExperienceDoc>('userExperiences')
  ),
  courses: new FirestoreDataSource<CourseDoc, unknown>(
    typedCollection<CourseDoc>('courses')
  ),
  // getCourseAdmins: (course: string) =>
  //   new FirestoreDataSource<CourseAdminDoc, Context>(
  //     typedCollection<CourseAdminDoc>(`courses/${course}/admins`)
  //   ),
});

export default dataSources;
