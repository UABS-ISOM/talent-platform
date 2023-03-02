import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/typeDefs/*.graphql',
  generates: {
    'src/__generated__/graphql.ts': {
      config: {
        contextType: '../context#Context',
        mappers: {
          User: '../mappers#UserMapper',
          UserExperience: '../mappers#UserExperienceMapper',
          Course: '../mappers#CourseMapper',
          CourseChat: '../mappers#CourseChatMapper',
          ChatMessage: '../mappers#ChatMessageWrapper',
          CourseProject: '../mappers#CourseProjectsMapper',
          CourseGroupProject: '../mappers#CourseGroupProjectMapper',
          CourseStudent: '../mappers#CourseStudentMapper',
        },
        scalars: {
          Date: 'string',
        },
      },
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
};

export default config;
