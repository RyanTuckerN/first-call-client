export const postOrganizer = (postArr) => {
  const mapped = postArr
    .sort((a, b) => b.upvotes - a.upvotes)
    .map((post) => {
      return {
        ...post,
        children: postArr
          .filter((p) => post.id === p.childOf)
          .map((po) => po.id),
      };
    })
    .sort((a, b) => b.id - a.id);
  const hash = mapped.reduce((a, b) => {
    a[b.id] = { ...b };
    return a;
  }, {});

  mapped.forEach((post) => {
    post.children = post.children.map((child) => hash[child]);
    hash[post.id] = post;
  });
  return mapped.sort((a, b) => b.upvotes - a.upvotes).filter((p) => !p.childOf);
};
