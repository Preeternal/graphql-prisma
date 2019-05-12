import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../src/prisma";

const userOne = {
  input: { name: "Jen", email: "jen@mail.com", password: bcrypt.hashSync("dark#@123dd") },
  user: undefined,
  jwt: undefined
};

const postOne = {
  input: {
    title: "some post",
    body: "",
    published: true
  },
  post: undefined
};

const postTwo = {
  input: {
    title: "some post2",
    body: "",
    published: false
  },
  post: undefined
};

const seedDatabase = async () => {
  // delete test data
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // create userOne
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

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
};

export { seedDatabase as default, userOne, postOne, postTwo };
