module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    '../../.eslintrc.json',
    'airbnb',
    'airbnb-typescript',
    'eslint-config-prettier',
  ],
  parserOptions: {
    project: ['apps/photography-guild/tsconfig.*?.json'],
  },
  plugins: ['react', '@typescript-eslint'],
  ignorePatterns: [
    '!**/*',
    'tailwind.config.js',
    'vite.config.ts',
    'codegen.js',
    '.eslintrc.js',
    'postcss.config.js',
    'node_modules/',
    'dist/',
    'build/',
    'src/generated/*.ts',
  ],
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/indent': 'off',
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
