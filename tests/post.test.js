import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import seedDatabase, { userOne, postOne, postTwo } from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import { getPosts, myPosts, updatePost, createPost, deletePost } from "./utils/operations";

jest.setTimeout(30000);

const client = getClient();

beforeEach(seedDatabase);

test("Should expose published posts", async () => {
  const response = await client.query({ query: getPosts });
  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBe(true);
});

test("Should fetch myPosts", async () => {
  const client = getClient(userOne.jwt);
  const { data } = await client.query({ query: myPosts });
  expect(data.myPosts.length).toBe(2);
});

test("Should be able to update own post", async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: postOne.post.id,
    data: {
      published: false
    }
  };
  const { data } = await client.mutate({ mutation: updatePost, variables });
  const exists = await prisma.exists.Post({ id: postOne.post.id, published: false });
  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test("Should create a new post", async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    data: { title: "Post #3", body: "", published: true }
  };
  const { data } = await client.mutate({ mutation: createPost, variables });
  const posts = await prisma.query.posts();
  expect(data.createPost.title).toBe("Post #3");
  expect(posts.length).toBe(3);
});

test("Should delete post", async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: postTwo.post.id
  };
  const { data } = await client.mutate({ mutation: deletePost, variables });
  const posts = await prisma.query.posts();
  const exists = await prisma.exists.Post({ id: postTwo.post.id });
  expect(data.deletePost.id).toBe(postTwo.post.id);
  expect(posts.length).toBe(1);
  expect(exists).toBe(false);
});
