import type { DocumentData } from 'firebase-admin/firestore';

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
  readonly collection: 'courses';
  name: string;
  description: string;
  numStaff: number;
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
  readonly collection: 'courses/courseAdmins';
  userId: string;
}
