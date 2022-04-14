import * as ReactDOM from 'react-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { App } from './App';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { Outlet, Router } from '@tanstack/react-location';
import { NewLocation } from '@juxt-home/utils';

const location = NewLocation();
const queryClient = new QueryClient();
const rootElement = document.getElementById('root');

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Router
      location={location}
      routes={[
        {
          path: '/_apps/photography-guild/index.html',
          element: <App />,
        },
        {
          path: '/_apps/photography-guild',
          element: <App />,
        },
        {
          path: '/',
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
  </QueryClientProvider>,
  rootElement,
);
