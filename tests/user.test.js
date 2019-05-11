import "cross-fetch/polyfill";
import ApolloBoost, { gql } from "apollo-boost";
import bcrypt from "bcryptjs";
import prisma from "../src/prisma";

jest.setTimeout(30000);

const client = new ApolloBoost({
  uri: "http://localhost:4000"
});

beforeEach(async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  const user = await prisma.mutation.createUser({
    data: {
      name: "Jen",
      email: "jen@mail.com",
      password: bcrypt.hashSync("dark#@123dd")
    }
  });
  await prisma.mutation.createPost({
    data: {
      title: "some post",
      body: "",
      published: true,
      author: {
        connect: {
          id: user.id
        }
      }
    }
  });
  await prisma.mutation.createPost({
    data: {
      title: "some post2",
      body: "",
      published: false,
      author: {
        connect: {
          email: "jen@mail.com"
        }
      }
    }
  });
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

test("Should expose published posts", async () => {
  const getPosts = gql`
    query {
      posts {
        id
        title
        body
        published
        author {
          name
        }
        comments {
          text
        }
      }
    }
  `;
  const response = await client.query({ query: getPosts });
  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBe(true);
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
