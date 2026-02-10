// import { createPainSolutionPost } from "./painSolution.service";

// export async function createBulkPosts({
//   userId,
//   saasContext,
//   count,
// }: {
//   userId: string;
//   saasContext: Record<string, any>;
//   count: number;
// }) {
//   const results = [];

//   for (let i = 0; i < count; i++) {
//     const post = await createPainSolutionPost({
//       userId,
//       saasContext,
//     });

//     results.push({
//       index: i,
//       ...post,
//     });
//   }
// //Run parrallel tasks instead of sequential(sends three requests at once to the api)
// // const tasks = Array.from({ length: count }, (_, i) =>
// //     createPainSolutionPost({ userId, saasContext })
// //       .then(post => ({ index: i, ...post }))
// //   );

// //   return Promise.all(tasks);


//   return results;
// }