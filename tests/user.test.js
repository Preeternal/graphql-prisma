import "cross-fetch/polyfill";
import ApolloBoost, { gql } from "apollo-boost";
import prisma from "../src/prisma";

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
  const exists = await prisma.exists.User({ id: response.data.createUser.user.id });
  expect(exists).toBe(true);
});
