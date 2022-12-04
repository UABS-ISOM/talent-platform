import type { QueryResolvers } from '../__generated__/graphql';
import { me } from './queries/me';
import { course } from './queries/course';
import { courseStudents } from './queries/courseStudents';

// Resolvers for the Course type
const resolver: QueryResolvers = {
  me,
  course,
  courseStudents,
};

export default resolver;
