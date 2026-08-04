import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://graphql.anilist.co',
  documents: ['src/api/gql/**/*.ts'],
  generates: {
    'src/api/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
  },
}

export default config
