import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/typeDefs/*.graphql',
  generates: {
    'src/__generated__/graphql.ts': {
      config: { contextType: 'src/context#Context' },
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
};

export default config;
