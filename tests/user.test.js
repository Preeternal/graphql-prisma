import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import prisma from "../src/prisma";
import seedDatabase from "./utils/seedDatabase";
import getClient from "./utils/getClient";

jest.setTimeout(30000);

const client = getClient();

beforeEach(seedDatabase);

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

test("Should expose public author profile", async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `;
  const response = await client.query({ query: getUsers });
  expect(response.data.users.length).toBe(1);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe("Jen");
});

test("Should not login with bad credentials", async () => {
  const login = gql`
    mutation {
      login(data: { email: "preeternal@mail.com", password: "1234567" }) {
        token
      }
    }
  `;
  await expect(client.mutate({ mutation: login })).rejects.toThrow();
});

test("Should not signup user with short password", async () => {
  const createUser = gql`
    mutation {
      createUser(data: { name: "new user", email: "new@mail.com", password: "12345" }) {
        token
      }
    }
  `;
  await expect(client.mutate({ mutation: createUser })).rejects.toThrow();
});
