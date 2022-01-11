import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { App } from "./App";
import "./styles.css";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
const rootElement = document.getElementById("root");
ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
  rootElement
);
