import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider, InMemoryCache } from "@apollo/client";
import App from "./App";
import { ApolloClient } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql", // URL of the GraphQL server
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
