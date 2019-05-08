import { Prisma } from "prisma-binding";
import { fragmentReplacements } from "./resolvers/index";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements
});

export { prisma as default };

// const createPostForUser = async (authorID, data) => {
//   const userExists = await prisma.exists.User({ id: authorID });
//   if (!userExists) {
//     throw new Error("User not found");
//   }
//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorID
//           }
//         }
//       }
//     },
//     "{author { id name email posts {id title published} }}"
//   );
//   return post.author;
// };

// // createPostForUser("cjudt0bwd001v0738bftr9ewz", {
// //   title: "Great film about",
// //   body: "Space",
// //   published: true
// // })
// //   .then(user => {
// //     console.log(JSON.stringify(user, undefined, 2));
// //   })
// //   .catch(error => {
// //     console.log(error.message);
// //   });

// const updatePostForUser = async (postId, data) => {
//   const postExists = await prisma.exists.Post({ id: postId });
//   if (!postExists) {
//     throw new Error("Post not found");
//   }
//   const post = await prisma.mutation.updatePost(
//     {
//       where: {
//         id: postId
//       },
//       data
//     },
//     "{ author { id name email posts { id title published } } }"
//   );
//   return post.author;
// };

// // updatePostForUser("cjudu2buj007a0738e1kzh8xd", {
// //   title: "Prisma second post",
// //   body: "nothing to write",
// //   published: false
// // })
// //   .then(user => {
// //     console.log(JSON.stringify(user, undefined, 2));
// //   })
// //   .catch(error => {
// //     console.log(error.message);
// //   });

// // prisma.query.users(null, "{id name posts { id title }}").then(data => {
// //   console.log(JSON.stringify(data, undefined, 2));
// // });

// // prisma.query.comments(null, "{id text author {name} post {title}}").then(data => {
// //   console.log(JSON.stringify(data, undefined, 2));
// // });

// // prisma.mutation
// //   .createPost(
// //     {
// //       data: {
// //         title: "GraphQL 101",
// //         body: "",
// //         published: false,
// //         author: {
// //           connect: {
// //             id: "cjudt0bwd001v0738bftr9ewz"
// //           }
// //         }
// //       }
// //     },
// //     "{id title body published}"
// //   )
// //   .then(data => {
// //     console.log(data);
// //     return prisma.query.users(null, "{id name posts { id title }}");
// //   })
// //   .then(data => {
// //     console.log(JSON.stringify(data, undefined, 2));
// //   });

// // prisma.mutation
// //   .updatePost(
// //     {
// //       data: {
// //         body: "some data",
// //         published: "true"
// //       },
// //       where: {
// //         id: "cjui7yiwm009o0744vrh6g9sf"
// //       }
// //     },
// //     "{id title body published}"
// //   )
// //   .then(data => {
// //     console.log(data);
// //     return prisma.query.posts(null, "{id title body published}");
// //   })
// //   .then(data => {
// //     console.log(JSON.stringify(data, undefined, 2));
// //   });
