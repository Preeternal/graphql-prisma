import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../src/prisma";

const userOne = {
  input: { name: "Jen", email: "jen@mail.com", password: bcrypt.hashSync("dark#@123dd") },
  user: undefined,
  jwt: undefined
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

  await prisma.mutation.createPost({
    data: {
      title: "some post",
      body: "",
      published: true,
      author: {
        connect: {
          id: userOne.user.id
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
};

export { seedDatabase as default, userOne };
