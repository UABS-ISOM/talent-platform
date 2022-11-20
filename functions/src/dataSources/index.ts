import type {
  UserDoc,
  UserExperienceDoc,
  CourseDoc,
  CourseAdminDoc,
} from './models';
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
  getCourseAdmins: (
    course: string
  ) => FirestoreDataSource<CourseAdminDoc, unknown>;
};

/**
 * Apollo data sources
 * @returns Data source objects
 */
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
  getCourseAdmins: (course: string) =>
    new FirestoreDataSource<CourseAdminDoc, unknown>(
      typedCollection<CourseAdminDoc>('courses', course, 'courseAdmins')
    ),
});

export default dataSources;
