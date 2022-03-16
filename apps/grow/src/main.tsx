import * as ReactDOM from 'react-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { App } from './app/App';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { Outlet, ReactLocation, Router } from 'react-location';
import { parseSearch, stringifySearch } from '@tanstack/react-location-jsurl';
import splitbee from '@splitbee/web';
import { StrictMode } from 'react';
import Item from './item/Item';

const location = new ReactLocation({
  parseSearch,
  stringifySearch,
});
const queryClient = new QueryClient();
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
      <Router
        location={location}
        routes={[
          {
            path: '/',
            element: <App />,
          },
          {
            path: 'item',
            children: [
              {
                path: ':item',
                element: <Item />,
              },
            ],
          },
          {
            path: '/*',
            element: <App />,
          },
        ]}>
        <Outlet />
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
