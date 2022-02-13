SITE_BASE_URI='https://alexd.uk/site'
GRAPHQL_PATH='/kanbantest/graphql'
GRAPHQL_API_URL="${SITE_BASE_URI}${GRAPHQL_PATH}"
site -s check-token || site get-token -u admin -p admin
yarn generate
yarn build
site put-static-site -d build -p _apps/kanban --spa true
