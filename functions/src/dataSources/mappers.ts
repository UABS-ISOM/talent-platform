import type { UserRecord } from 'firebase-admin/auth';
import type { CourseAdminDoc, UserDoc, UserExperienceDoc } from './models';
import type { CollectionReference, Query } from 'firebase-admin/firestore';

export interface UserMapper {
  _uid: string;
  _getUserDoc: () => Promise<UserDoc>;
  _getUserRecord: () => Promise<UserRecord>;
}

export interface UserExperienceMapper {
  _id: string;
  _userExperienceDoc: UserExperienceDoc;
}

export interface CourseMapper {
  _courseId: string;
  _courseStaffQuery: (
    ref: CollectionReference<CourseAdminDoc>
  ) => Query<CourseAdminDoc>;
}
