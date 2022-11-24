import type { UserRecord } from 'firebase-admin/auth';

export interface UserMapper {
  _uid: string;
  _getUserRecord: () => Promise<UserRecord>;
}

export interface UserExperienceMapper {
  _id: string;
}
