import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import prisma from "../src/prisma";
import seedDatabase from "./utils/seedDatabase";
import getClient from "./utils/getClient";

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
