import React, { Component } from "react";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";

const fragment = gql`
  fragment LocalTodo on Todo {
    id
    complete
    text
    updatedAt
    __typename
  }
`;

class Todo extends Component {
  constructor(props) {
    super(props);

    const { client, id } = props;

    let todo;
    try {
      todo = client.cache.readFragment(
        {
          fragment,
          id: client.cache.config.dataIdFromObject({ id, __typename: "Todo" })
        },
        true
      );
    } catch (error) {
      console.log("error: ", error);
    }

    this.state = { todo };
  }

  reload = () => {
    const { client, id } = this.props;

    let todo;
    try {
      todo = client.cache.readFragment(
        {
          fragment,
          id: client.cache.config.dataIdFromObject({ id, __typename: "Todo" })
        },
        true
      );
    } catch (error) {
      console.log("error: ", error);
    }

    if (todo) {
      this.setState({ todo });
    }
  };

  render() {
    const { id } = this.props;
    const { todo } = this.state;
    console.log("todo: ", todo);

    return (
      <li>
        <h2>id: {id}</h2>
        {todo ? (
          <div>
            <p>Todo Found</p>
            <p>{todo.text}</p>
          </div>
        ) : (
          <p>Todo is {String(todo)}</p>
        )}
        <button onClick={this.reload}>Reload</button>
      </li>
    );
  }
}

export default withApollo(Todo);
