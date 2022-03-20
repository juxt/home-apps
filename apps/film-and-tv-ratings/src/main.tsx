import * as ReactDOM from 'react-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Home } from './pages/Home';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { Outlet, ReactLocation, Router } from 'react-location';
import { parseSearch, stringifySearch } from '@tanstack/react-location-jsurl';
import splitbee from '@splitbee/web';
import { StrictMode } from 'react';
import { SearchResults } from './pages/SearchResults';
import { NavStructure } from './types';
import { Movie } from './pages/Movie';
import { TvShow } from './pages/TvShow';

const location = new ReactLocation({
  parseSearch,
  stringifySearch,
});
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
        location={location}
        routes={[
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
                        return <TvShow />;
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
        <>
          <Home />
          <Outlet />
        </>
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
