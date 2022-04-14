module.exports = {
  schema: 'schema.graphql',
  documents: 'src/**/*.graphql',
  generates: {
    'src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        exposeQueryKeys: true,
        exposeDocument: true,
        exposeFetcher: true,
        errorType: 'Error',
        fetcher: {
          endpoint: 'https://alexd.uk/pairing/photography/graphql',
          fetchParams: JSON.stringify({
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            credentials: 'include',
          }),
        },
      },
    },
    'src/generated/validation.ts': {
      plugins: ['typescript-validation-schema'],
      config: {
        schema: 'yup',
        notAllowEmptyString: true,
        importFrom: './graphql',
        enumAsTypes: true,
        directives: {
          required: {
            msg: 'required',
          },
          constraint: {
            minLength: 'min',
            startsWith: ['matches', '/^$1/'],
            format: {
              email: 'email',
            },
          },
        },
      },
    },
  },
};
