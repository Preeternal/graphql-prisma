import "cross-fetch/polyfill";
import ApolloBoost, { gql } from "apollo-boost";

jest.setTimeout(30000);

const client = new ApolloBoost({
  uri: "http://localhost:4000"
});

test("Should create a new user", async () => {
  const createUser = gql`
    mutation {
      createUser(data: { name: "Eternal", email: "eternal@mail.com", password: "12345678" }) {
        token
        user {
          id
        }
      }
    }
  `;
  const response = await client.mutate({
    mutation: createUser
  });
});
