import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/typeDefs/*.graphql',
  generates: {
    'src/__generated__/graphql.ts': {
      config: {
        contextType: '../context#Context',
        mappers: {
          User: 'src/mappers#UserMapper',
          UserExperience: '../dataSources/mappers#UserExperienceMapper',
          Course: '../dataSources/mappers#CourseMapper',
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
