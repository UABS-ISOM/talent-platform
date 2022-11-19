import type { UserRecord } from 'firebase-admin/auth';
import type { UserDoc, UserExperienceDoc, CourseDoc } from './models';

export interface UserMapper {
  _getUserDoc: () => Promise<UserDoc>;
  _getUserRecord: () => Promise<UserRecord>;
}

export interface UserExperienceMapper {
  _id: string;
  _userExperienceDoc: UserExperienceDoc;
}

export interface CourseMapper {
  _id: string;
  _courseDoc: CourseDoc;
}
