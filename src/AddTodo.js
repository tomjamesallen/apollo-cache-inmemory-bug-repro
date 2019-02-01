import React, { Component } from "react";
import { withApollo } from "react-apollo";
import randomWords from "random-words";
import gql from "graphql-tag";
import uniqueId from "lodash.uniqueid";

const CREATE_TODO = gql`
  mutation createTodo($text: String!) {
    createTodo(complete: false, text: $text) {
      id
      complete
      text
      updatedAt
      __typename
    }
  }
`;

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

class AddTodo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      randomText: randomWords({ exactly: 1, wordsPerString: 4 })[0]
    };
  }

  newWords = () => {
    this.setState({
      randomText: randomWords({ exactly: 1, wordsPerString: 4 })[0]
    });
  };

  createTodo = () => {
    const { client } = this.props;
    const { randomText } = this.state;

    const onUpdate = (proxy, { data: { createTodo } }) => {
      // Write new item to list.
      const allTodosData = proxy.readQuery({
        query: ALL_TODOS
      });

      proxy.writeQuery({
        query: ALL_TODOS,
        data: {
          ...allTodosData,
          allTodoes: [...allTodosData.allTodoes, createTodo]
        }
      });
    };

    const now = new Date().toISOString();

    const optimisticResponse = {
      createTodo: {
        id: uniqueId("LOCAL_TODO/"),
        text: randomText,
        updatedAt: now,
        complete: false,
        __typename: "TODO"
      },
      __typename: "Mutation"
    };

    client
      .mutate({
        mutation: CREATE_TODO,
        update: onUpdate,
        optimisticResponse,
        variables: { text: randomText }
      })
      .then(response => {
        console.log("response: ", response);
      });
  };

  render() {
    return (
      <div>
        <h2>Create a random todo</h2>
        <div>text: {this.state.randomText}</div>
        <button onClick={this.newWords}>New words</button>
        <button onClick={this.createTodo}>Create Todo</button>
      </div>
    );
  }
}

export default withApollo(AddTodo);
