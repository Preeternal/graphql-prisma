import bcrypt from "bcryptjs";
import prisma from "../../src/prisma";

const seedDatabase = async () => {
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
};

export default seedDatabase;
