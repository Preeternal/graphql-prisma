import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import prisma from "../src/prisma";
import seedDatabase, { userOne, postOne, postTwo } from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import { selectHttpOptionsAndBody } from "apollo-link-http-common";

jest.setTimeout(30000);

const client = getClient();

beforeEach(seedDatabase);

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

test("Should be able to update own post", async () => {
  const client = getClient(userOne.jwt);
  const updatePost = gql`
    mutation {
      updatePost(
        id: "${postOne.post.id}",
        data: {
          published: false
        }
      ) {
        id
        title
        body
        published
      }
    }
  `;
  const { data } = await client.mutate({ mutation: updatePost });
  const exists = await prisma.exists.Post({ id: postOne.post.id, published: false });
  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test("Should create a new post", async () => {
  const client = getClient(userOne.jwt);
  const createPost = gql`
    mutation {
      createPost(data: { title: "Post #3", body: "", published: true }) {
        id
        title
        body
        published
      }
    }
  `;
  const { data } = await client.mutate({ mutation: createPost });
  const posts = await prisma.query.posts();
  expect(data.createPost.title).toBe("Post #3");
  expect(posts.length).toBe(3);
});

test("Should delete post", async () => {
  const client = getClient(userOne.jwt);
  const deletePost = gql`
  mutation {
    deletePost(
      id: "${postTwo.post.id}"
    ){
      id
      title
      body
      published
    }
  }
  `;
  const { data } = await client.mutate({ mutation: deletePost });
  const posts = await prisma.query.posts();
  const exists = await prisma.exists.Post({ id: postTwo.post.id });
  expect(data.deletePost.id).toBe(postTwo.post.id);
  expect(posts.length).toBe(1);
  expect(exists).toBe(false);
});
