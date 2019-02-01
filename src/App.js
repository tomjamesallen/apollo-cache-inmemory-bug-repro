import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";

import createClient from "./createClient";
import TodoList from "./TodoList";

const client = createClient();

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <TodoList />
      </ApolloProvider>
    );
  }
}

export default App;
