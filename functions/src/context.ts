import { CollectionReference } from 'firebase-admin/firestore';
import { CourseDoc } from './collections/models';

/**
 * Type of the available data sources
 *
 * @export
 * @typedef {Collections}
 */
export type Collections = {
  courses: CollectionReference<CourseDoc>;
};

/**
 * The context provided to each Apollo resolver
 *
 * @export
 * @interface Context
 * @typedef {Context}
 */
export default interface Context {
  collections: Collections;
}
