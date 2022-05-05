Monorepo for internal JUXT apps

This monorepo uses [NX](https://nx.dev) to manage packages, builds, tests and development servers. It is a little complex (like a lot of js tools), but it allows very easy reuse of frontend components such as the generated site hooks.

It is recommended to install the NX vscode extension which saves you from remembering all the difference commands (generating new projects, testing, running, building etc).

There are two parts to developing one of these apps, the 'backend' and the frontend. The frontend can use any build system (clojurescript/etc) but NX built in tooling will use webpack and babel. The backend uses [Site](https://github.com/juxt/site) which generates a graphql API given a schema file. The same schema file is also used to generate react-hooks using graphql-code-generator and react-query.

## Initial Setup

First run `yarn` from the root of the project. This will install all the dependencies and may take a while. Then run `yarn` from any directory with its own package.json (currently /libs/site and /apps/photography-guild).

## Running a Frontend app

The basic command for running any frontend app is `yarn nx run {APP_NAME}:serve` where {APP_NAME} is the name of the app. For example `yarn nx run photography-guild:serve`.

## Backend (changing the schema/generated graphql hooks)

You can either use the schema file in libs/site or make your own (see the photography app for an example of that). But if you want to make changes to the schema, you'll need to run the schema watcher script for the schema you are using. For example, in the photography app directory, run (after running `yarn` to install the dependencies):

```
yarn prod-generate
```

which will build react hooks for each 'operation' in operations.graphql as well as deploying the schema to the remote Site server when you edit the file.

If you have a local Site server running, see if there is a `dev-generate` command in the `package.json` file. If not you should be able to figure it out as its just a case of updating the domain from the prod example.
