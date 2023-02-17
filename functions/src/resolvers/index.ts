import type { Resolvers } from '../__generated__/graphql';
import { DateResolver } from 'graphql-scalars';
import Query from './Query';
import Mutation from './Mutation';
import User from './User';
import UserExperience from './UserExperience';
import Course from './Course';
import CourseChat from './CourseChat';
import ChatMessage from './ChatMessage';
import CourseProject from './CourseProject';
import CourseGroupProject from './CourseGroupProject';

const resolvers: Resolvers = {
  Query,
  Mutation,

  User,
  UserExperience,
  Course,
  CourseChat,
  ChatMessage,
  CourseProject,
  CourseGroupProject,
  Date: DateResolver,
};

export default resolvers;
