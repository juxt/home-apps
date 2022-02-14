SITE_BASE_URI='http://localhost:5509'
GRAPHQL_PATH='/kanbantest/graphql'
GRAPHQL_API_URL="${SITE_BASE_URI}${GRAPHQL_PATH}"
site -s check-token || site get-token -u admin -p admin
site post-resources --file resources.edn
site put-graphql --file schema.graphql --path $GRAPHQL_PATH 
