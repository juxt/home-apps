module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:react/jsx-runtime',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  ignorePatterns: ['node_modules/', 'dist/', 'build/', 'src/generated/*.ts'],
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-nested-ternary': 'off',
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        controlComponents: ['Input', 'Select', 'Textarea'],
      },
    ],
    'react/require-default-props': 'off',
    'react/jsx-no-useless-fragment': 'off',
    'no-underscore-dangle': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.tsx'],
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
};
