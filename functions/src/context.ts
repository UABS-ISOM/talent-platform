import { DecodedIdToken } from 'firebase-admin/auth';
import { CollectionReference } from 'firebase-admin/firestore';
import { UserDoc, CourseDoc, UserExperienceDoc } from './collections/models';

/**
 * Type of the available data sources
 *
 * @export
 * @typedef {Collections}
 */
export type Collections = {
  users: CollectionReference<UserDoc>;
  userExperiences: CollectionReference<UserExperienceDoc>;
  courses: CollectionReference<CourseDoc>;
};

/**
 * The context provided to each Apollo resolver
 *
 * @export
 * @interface Context
 * @typedef {Context}
 */
export interface Context {
  user: DecodedIdToken | undefined;
  collections: Collections;
}
