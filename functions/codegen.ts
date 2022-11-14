import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/typeDefs/*.graphql',
  generates: {
    'src/__generated__/graphql.ts': {
      config: {
        contextType: '../context#Context',
        mappers: {
          User: '../collections/models#UserMapper',
          UserExperience: '../collections/models#UserExperienceMapper',
          Course: '../collections/models#CourseMapper',
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
