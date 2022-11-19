import type { UserRecord } from 'firebase-admin/auth';
import type { UserDoc, UserExperienceDoc } from './models';

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
}
