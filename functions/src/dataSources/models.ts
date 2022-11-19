import type { DocumentData } from 'firebase-admin/firestore';

/**
 * A document in the Firestore users collection
 *
 * @export
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface UserDoc extends DocumentData {
  readonly id: string;
  readonly collection: 'users';
  pronouns?: string;
  overview?: string;
  skills?: string[];
}

/**
 * A document in the Firestore users collection
 *
 * @export
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface UserExperienceDoc extends DocumentData {
  readonly id: string;
  readonly collection: 'users';
  userId: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
}

/**
 * A document in the Firestore courses collection
 *
 * @export
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface CourseDoc extends DocumentData {
  readonly id: string;
  readonly collection: 'users';
  name: string;
  description: string;
}

/**
 * A document in the Firestore courses/admins collection
 *
 * @export
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface CourseAdminDoc extends DocumentData {
  readonly id: string;
  readonly collection: 'users';
  role: 'lecturer' | 'assistant';
}
