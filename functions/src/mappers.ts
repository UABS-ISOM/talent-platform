import type { OutputDocumentData } from 'data-loader-firestore';
import type { CollectionReference, Query } from 'firebase-admin/firestore';
import type { CourseAdminModel } from './dataLoaders/models';

export interface UserMapper {
  _uid: string;
}

export interface UserExperienceMapper {
  _id: string;
}

export interface CourseMapper {
  _id: string;
  _courseStaffQuery: (
    ref: CollectionReference<OutputDocumentData<CourseAdminModel>>
  ) => Query;
  _courseStudentsQuery: (
    ref: CollectionReference<OutputDocumentData<CourseAdminModel>>
  ) => Query;
}
