import type { QueryResolvers } from '../__generated__/graphql';
import { me } from './queries/me';
import { course } from './queries/course';
import { courseStudents } from './queries/courseStudents';
import { courseStudent } from './queries/courseStudent';
import { courseChat } from './queries/courseChat';
import { chatHistory } from './queries/chatHistory';
import { coursePersonalChat } from './queries/coursePersonalChat';
import { courseProject } from './queries/courseProject';

// Resolvers for the Course type
const resolver: QueryResolvers = {
  me,
  course,
  courseStudents,
  courseStudent,
  courseChat,
  chatHistory,
  coursePersonalChat,
  courseProject,
};

export default resolver;
