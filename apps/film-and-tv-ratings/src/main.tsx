import * as ReactDOM from 'react-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Home } from './pages/Home';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { Outlet, Router } from '@tanstack/react-location';
import splitbee from '@splitbee/web';
import { StrictMode } from 'react';
import { SearchResults } from './pages/SearchResults';
import { NavStructure } from './types';
import { Movie } from './pages/Movie';
import { TvShow } from './pages/TvShow';
import { Box } from '@mantine/core';
import 'regenerator-runtime/runtime.js';
import { RecentReviews } from './pages/RecentReviews';
import { newReactLocation } from '@juxt-home/utils';
import { Group } from '@mantine/core';

const reactLocation = newReactLocation();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      keepPreviousData: true,
    },
  },
});
const rootElement = document.getElementById('root');
if (window.location.hostname !== 'localhost') {
  splitbee.init({
    scriptUrl: '/bee.js',
    apiUrl: '/_hive',
  });
}
ReactDOM.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router<NavStructure>
        location={reactLocation}
        routes={[
          {
            path: '/',
            element: <RecentReviews />,
          },
          {
            path: '/search/:searchType',
            element: <SearchResults />,
            children: [
              {
                path: '/:itemId',
                element: async ({ params: { searchType, itemId } }) => {
                  if (itemId) {
                    switch (searchType) {
                      case 'movie':
                        return <Movie itemId={itemId} />;
                      case 'tv':
                        return <TvShow itemId={itemId} />;
                      default:
                        return <Movie itemId={itemId} />;
                    }
                  } else {
                    return null;
                  }
                },
              },
            ],
          },
          {
            path: 'tv',
            element: <h1>TV page</h1>,
          },
          {
            path: '/*',
            element: <p> not found </p>,
          },
        ]}>
        <Box sx={{ margin: '3em' }}>
          <Group>
            <Home />
          </Group>
          <Outlet />
        </Box>
      </Router>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
  rootElement,
);
