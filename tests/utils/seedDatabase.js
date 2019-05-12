import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../src/prisma";

const userOne = {
  input: { name: "Jen", email: "jen@mail.com", password: bcrypt.hashSync("dark#@123dd") },
  user: undefined,
  jwt: undefined
};

const userTwo = {
  input: { name: "John", email: "johnny@mail.com", password: bcrypt.hashSync("manInBlack") },
  user: undefined,
  jwt: undefined
};

const postOne = {
  input: {
    title: "some post 1",
    body: "",
    published: true
  },
  post: undefined
};

const postTwo = {
  input: {
    title: "some post 2",
    body: "",
    published: false
  },
  post: undefined
};

const commentOne = {
  input: {
    text: "comment 1"
  },
  comment: undefined
};

const commentTwo = {
  input: {
    text: "comment 2"
  },
  comment: undefined
};

const seedDatabase = async () => {
  // delete test data
  await prisma.mutation.deleteManyComments();
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // create userOne
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  // create userTwo
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input
  });
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET);

  // create post one
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });

  // create post two
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          email: "jen@mail.com"
        }
      }
    }
  });

  // create comment one by second user
  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      post: {
        connect: {
          id: postOne.post.id
        }
      },
      author: {
        connect: {
          id: userTwo.user.id
        }
      }
    }
  });

  // create comment one by first user
  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      post: {
        connect: {
          id: postOne.post.id
        }
      },
      author: {
        connect: {
          email: "jen@mail.com"
        }
      }
    }
  });
};

export { seedDatabase as default, userOne, userTwo, postOne, postTwo, commentOne, commentTwo };
