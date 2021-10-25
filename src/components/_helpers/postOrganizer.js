export const posts = [
  {
    id: 1,
    author: 3,
    text: "This is a top level post.",
    childOf: null,
    upvotes: 5000,
    voters: [3],
    details: {},
    createdAt: "2021-10-14T18:22:49.431Z",
    updatedAt: "2021-10-14T18:22:49.431Z",
    gigId: 5,
  },
  {
    id: 2,
    author: 3,
    text: "Good point! I never really thought about it that way ",
    childOf: null,
    upvotes: 34,
    voters: [3],
    details: {},
    createdAt: "2021-10-14T18:23:15.249Z",
    updatedAt: "2021-10-14T18:23:15.249Z",
    gigId: 5,
  },
  {
    id: 3,
    author: 3,
    text: "Hell yea, I know what you mean. ",
    childOf: null,
    upvotes: 16,
    voters: [3],
    details: {},
    createdAt: "2021-10-14T18:23:17.429Z",
    updatedAt: "2021-10-14T18:23:17.429Z",
    gigId: 5,
  },
  {
    id: 4,
    author: 3,
    text: "This isn't really all that bad! ",
    childOf: 1,
    upvotes: 14,
    voters: [3],
    details: {},
    createdAt: "2021-10-14T18:23:32.290Z",
    updatedAt: "2021-10-14T18:23:32.290Z",
    gigId: 5,
  },
  {
    id: 5,
    author: 3,
    text: "Kind of wild if you ask me. I don't know what they were thinking. ",
    childOf: 1,
    upvotes: 42,
    voters: [3],
    details: {},
    createdAt: "2021-10-14T18:23:40.242Z",
    updatedAt: "2021-10-14T18:23:40.242Z",
    gigId: 5,
  },
  {
    id: 6,
    author: 3,
    text: "this is a response! ",
    childOf: 1,
    upvotes: 2,
    voters: [3],
    details: {},
    createdAt: "2021-10-14T18:23:42.442Z",
    updatedAt: "2021-10-14T18:23:42.442Z",
    gigId: 5,
  },
  {
    id: 7,
    author: 3,
    text: "this is a response! ",
    childOf: 6,
    upvotes: 77,
    voters: [3],
    details: {},
    createdAt: "2021-10-14T18:54:49.918Z",
    updatedAt: "2021-10-14T18:54:49.918Z",
    gigId: 5,
  },
  {
    id: 8,
    author: 3,
    text: "this is a response! ",
    childOf: 6,
    upvotes: 43,
    voters: [3],
    details: {},
    createdAt: "2021-10-14T18:54:52.175Z",
    updatedAt: "2021-10-14T18:54:52.175Z",
    gigId: 5,
  },
  {
    id: 9,
    author: 3,
    text: "this is a response! ",
    childOf: 7,
    upvotes: 10,
    voters: [3],
    details: {},
    createdAt: "2021-10-14T18:54:55.073Z",
    updatedAt: "2021-10-14T18:54:55.073Z",
    gigId: 5,
  },
  {
    id: 10,
    author: 3,
    text: "this is a response! ",
    childOf: 7,
    upvotes: 111,
    voters: [3],
    details: {},
    createdAt: "2021-10-14T18:54:56.541Z",
    updatedAt: "2021-10-14T18:54:56.541Z",
    gigId: 5,
  },
];

export const postOrganizer = (postArr) => {
  const mapped = postArr
    //convert posts to what only info we want
    // .map((post) => post.dataValues)
    //add id's of all children to new 'children' array
    .sort((a, b) => b.upvotes - a.upvotes)
    .map((post) => {
      return {
        ...post,
        children: postArr
          .filter((p) => post.id === p.childOf)
          .map((po) => po.id),
      };
    })
    // sort by id, highest to lowest
    // newer posts will always have higher id, we want to hash those first
    .sort((a, b) => b.id - a.id);

  // create a hashtable to store post information
  const hash = mapped.reduce((a, b) => {
    a[b.id] = { ...b };
    return a;
  }, {});

  mapped.forEach((post) => {
    //update children array to reflect the children's maps
    post.children = post.children.map((child) => hash[child]);
    //update hash for this post
    hash[post.id] = post;
  });

  //top level posts only
  return mapped.sort((a, b) => b.upvotes - a.upvotes).filter((p) => !p.childOf);
};

// const postOrg2 = postsArr => {
//   const topLevel = postsArr.filter(p=>!p.childOf)
//   console.log(topLevel)
//   const result = [...topLevel]
//   const fillInChildren = posts => {
//     if(post.children.length){

//     }
//   }
// }

// postOrg2(posts)
// const posts = [
//   {
//     id: 1,
//     text: "this is a post! ",
//     childOf: null,
//   },
//   {
//     id: 2,
//     text: "this is a response! ",
//     childOf: 1,
//   },
//   {
//     id: 3,
//     text: "this is a response to a  response! ",
//     childOf: 2,
//   },
//   {
//     id: 4,
//     text: "this is also a response! ",
//     childOf: null,
//   },
//   {
//     id: 5,
//     text: "this is a seperate response! ",
//     childOf: 1,
//   },
// ];
// const hash = posts.reduce((hash, post) => {
//   const { id, text, childOf } = post;
//   hash[id] = { text, childOf, children: [] };
//   return hash
// }, {});
// // console.log(hash)
// // const mapped = posts.map((p) => {
// //   return { ...p, children: [] };
// // });
// const keys = Object.keys(hash)
// console.log(keys)
// keys.forEach(post=>hash[post].children.push())

// const desiredStructure = [
//   {
//     id: 1,
//     text: "this is a post! ",
//     childOf: null,
//     children: [
//       {
//         id: 2,
//         text: "this is a response! ",
//         childOf: 1,
//         children: [
//           {
//             id: 3,
//             text: "this is a response to a  response! ",
//             childOf: 2,
//             children: [],
//           },
//         ],
//       },
//       {
//         id: 4,
//         text: "this is also a response! ",
//         childOf: 1,
//         children: [],
//       },
//     ],
//   },
//   {
//     id: 5,
//     text: "this is a seperate response! ",
//     childOf: 1,
//     children: [],
//   },
// ];
