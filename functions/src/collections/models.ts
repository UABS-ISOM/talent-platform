import { UserRecord } from 'firebase-admin/auth';
import { DocumentData } from 'firebase-admin/firestore';

/**
 * A document in the Firestore users collection
 *
 * @export
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface CourseDoc extends DocumentData {
  name: string;
  description: string;
}

export interface UserMapper {
  _userModel: UserRecord;
}

export interface CourseMapper {
  _id: string;
  _courseModel: CourseDoc;
}
