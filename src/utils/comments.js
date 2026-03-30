export const buildCommentTree = (flatComments) => {
  const map = {};
  const roots = [];

  flatComments.forEach(comment => {
    map[comment.id] = { ...comment, replies: [] };
  });

  flatComments.forEach(comment => {
    if (comment.reply_to) {
      if (map[comment.reply_to]) {
        map[comment.reply_to].replies.push(map[comment.id]);
      }
    } else {
      roots.push(map[comment.id]);
    }
  });

  return roots;
};