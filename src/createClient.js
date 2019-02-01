import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink, Observable } from "apollo-link";
import { HttpLink } from "apollo-link-http";

// This just blocked the `createTodo` mutation, faking an offline response.
const fakeOfflineLine = new ApolloLink((operation, forward) => {
  if (operation.operationName === "createTodo") {
    return new Observable(observer => {
      return () => () => {};
    });
  }

  return forward(operation);
});

const dataIdFromObject = result => {
  if (result && result.__typename) {
    if (result.id !== undefined) {
      // eslint-disable-next-line prefer-template
      return result.__typename + ":" + result.id;
    }
    if (result._id !== undefined) {
      // eslint-disable-next-line prefer-template
      return result.__typename + ":" + result._id;
    }
  }
  return null;
};

export default () => {
  const cache = new InMemoryCache({
    dataIdFromObject
  });

  const connection = new HttpLink({
    uri: "https://api.graph.cool/simple/v1/ciyiykz0p14400132y9ed5i6r"
  });

  const links = [fakeOfflineLine, connection];

  const client = new ApolloClient({
    cache,
    link: ApolloLink.from(links)
  });

  return client;
};
