import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import seedDatabase, {
  userOne,
  userTwo,
  postOne,
  postTwo,
  commentOne,
  commentTwo
} from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import {
  createComment,
  deleteComment,
  subscribeToComments,
  subscribeToPost
} from "./utils/operations";

jest.setTimeout(300000);

const client = getClient();

beforeEach(seedDatabase);

test("Should delete own comment", async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: commentTwo.comment.id
  };
  const { data } = await client.mutate({ mutation: deleteComment, variables });
  const comments = await prisma.query.comments();
  const exists = await prisma.exists.Comment({ id: commentTwo.comment.id });
  expect(data.deleteComment.id).toBe(commentTwo.comment.id);
  expect(comments.length).toBe(1);
  expect(exists).toBe(false);
});

test("Should not delete other users comment", async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: commentOne.comment.id
  };
  await expect(client.mutate({ mutation: deleteComment, variables })).rejects.toThrow();
});

test("Should create a new comment by second user", async () => {
  const client = getClient(userTwo.jwt);
  const variables = {
    data: { text: "Comment by the Johnny Cash", post: postOne.post.id }
  };
  const { data } = await client.mutate({ mutation: createComment, variables });
  const comments = await prisma.query.comments();
  expect(data.createComment.text).toBe("Comment by the Johnny Cash");
  expect(comments.length).toBe(3);
});

test("Should create a new comment by first user", async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    data: { text: "Comment by the Jen", post: postOne.post.id }
  };
  const { data } = await client.mutate({ mutation: createComment, variables });
  const comments = await prisma.query.comments();
  expect(data.createComment.text).toBe("Comment by the Jen");
  expect(comments.length).toBe(3);
});

test("Should subscribe to comments for a post", async done => {
  const variables = {
    postId: postOne.post.id
  };
  client.subscribe({ query: subscribeToComments, variables }).subscribe({
    next(response) {
      expect(response.data.comment.mutation).toBe("DELETED");
      done();
    }
  });
  // change a comment
  await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id } });
});

test("Should subscribe to changes for published posts", async done => {
  client.subscribe({ query: subscribeToPost }).subscribe({
    next(response) {
      expect(response.data.post.mutation).toBe("DELETED");
      done();
    }
  });
  await prisma.mutation.deletePost({ where: { id: postOne.post.id } });
});
