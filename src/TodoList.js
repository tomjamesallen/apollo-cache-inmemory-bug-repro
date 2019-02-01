import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import logo from "./logo.svg";
import "./App.css";
import Todo from "./Todo";
import AddTodo from "./AddTodo";

const ALL_TODOS = gql`
  query {
    allTodoes {
      id
      complete
      text
      updatedAt
      __typename
    }
  }
`;

class TodoList extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Query query={ALL_TODOS}>
            {({ data, loading }) => {
              if (!data || !data.allTodoes) {
                if (loading) {
                  return <p>Loading</p>;
                }
                return <p>Something went wrong</p>;
              }

              return (
                <ul>
                  {data.allTodoes.map(({ id }) => (
                    <Todo id={id} key={id} />
                  ))}
                </ul>
              );
            }}
          </Query>
          <AddTodo />
        </header>
      </div>
    );
  }
}

export default TodoList;
