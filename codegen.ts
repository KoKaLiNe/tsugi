import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://graphql.anilist.co',
  documents: ['src/api/gql/**/*.ts'],
  generates: {
    'src/api/generated/graphql.ts': {
      plugins: ['typescript-operations'],
    },
  },
  headers: {
    Referer: 'http://localhost:5173/',
  },
}

export default config
