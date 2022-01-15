import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { App } from "./App";
import "./styles.css";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import {
  Link,
  MakeGenerics,
  Outlet,
  ReactLocation,
  Router,
  useMatch,
} from "react-location";
const location = new ReactLocation();
const queryClient = new QueryClient();
const rootElement = document.getElementById("root");
ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Router
      location={location}
      routes={[
        {
          // path = "/*"
          element: <App />,
        },
      ]}
    >
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
  rootElement
);
