import {
  get,
  push,
  set,
  onValue,
  update,
  ref,
  query,
  orderByChild,
  runTransaction,
  remove
} from 'firebase/database';
import { db } from '../config/firebase-config';

export const addPost = async (author, title, content) => {
  return push(ref(db, 'posts'), {
    author,
    title,
    content,
    createdOn: Date.now(),
    comments: [],
  });
};

export const getAllPosts = async (search, createdBy) => {
  const snapshot = await get(
    query(ref(db, 'posts'), orderByChild('createdOn'))
  );
  if (!snapshot.exists()) {

    return [];
  }

  const posts = Object.keys(snapshot.val())
    .map((key) => ({
      id: key,
      ...snapshot.val()[key],
      createdOn: new Date(snapshot.val()[key].createdOn).toString(),
      createdBy: snapshot.val()[key].createdBy
        ? Object.keys(snapshot.val()[key].createdBy)
        : [],
    }))
  // .filter((post) => post.title.toLowerCase().includes(search.toLowerCase()));


  // console.log(posts);

  return posts;
};

export const getPostById = async (id) => {
  const snapshot = await get(ref(db, `posts/${id}`));
  if (!snapshot.exists()) {
    return null;
  }

  const post = {
    id,
    ...snapshot.val(),
    createdOn: new Date(snapshot.val().createdOn).toString(),
    createdBy: snapshot.val().createdBy
      ? Object.keys(snapshot.val().createdBy)
      : [],
    likedBy: snapshot.val().likedBy ? Object.keys(snapshot.val().likedBy) : [],
    dislikedBy: snapshot.val().dislikedBy ? Object.keys(snapshot.val().dislikedBy) : [],
  };

  return post;
};


export const likePost = async (username, postId) => {
  const updates = {};
  updates[`/posts/${postId}/likedBy/${username}`] = true;
  updates[`/users/${username}/likedPosts/${postId}`] = true;

  await update(ref(db), updates);

  await remove(ref(db, `/posts/${postId}/dislikedBy/${username}`));
  await remove(ref(db, `/users/${username}/dislikedPosts/${postId}`));
};

export const dislikePost = async (username, postId) => {
  const updates = {};
  updates[`/posts/${postId}/dislikedBy/${username}`] = true;
  updates[`/users/${username}/dislikedPosts/${postId}`] = true;

  await update(ref(db), updates);

  await remove(ref(db, `/posts/${postId}/likedBy/${username}`));
  await remove(ref(db, `/users/${username}/likedPosts/${postId}`));
};

export const addCommentToPost = async (postId, author, comment) => {
  const postSnapshot = await get(ref(db, `posts/${postId}`));
  if (!postSnapshot.exists()) {
    throw new Error('Post not found.');
  }

  const commentsRef = ref(db, `comments/${postId}`);
  const newCommentRef = push(commentsRef);
  return set(newCommentRef, { author, comment, commentedOn: Date.now() });
};

export async function getCommentsByPostId(postId) {
  const commentsRef = ref(db, `comments/${postId}`);

  return new Promise((resolve, reject) => {
    onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        resolve([]);
        return;
      }

      const comments = Object.keys(data).map((id) => ({
        id,
        ...data[id],
      }));

      resolve(comments);
    }, (error) => {
      reject(error);
    });
  });
}

export const updateComment = async (postId, commentId, author, updatedComment) => {
  const commentRef = ref(db, `comments/${postId}/${commentId}`);
  return update(commentRef, { author, comment: updatedComment, commentedOn: Date.now() });
};

export const getCommentsCount = async (postId) => {
  const postSnapshot = await get(ref(db, `posts/${postId}`));
  if (!postSnapshot.exists()) {
    throw new Error('Post not found.');
  }
  const post = postSnapshot.val();
  // console.log(post.comment);
  return post.comments ? Object.keys(post.comments).length : 0;
};

export const postCount = async () => {
  const snapshot = await get(ref(db, 'posts'));
  if (!snapshot.exists()) {
    return 0;
  }
  return Object.keys(snapshot.val()).length;
}

export const likeCount = async (postId) => {
  const snapshot = await get(ref(db, `posts/${postId}`));
  if (!snapshot.exists() || !snapshot.val().likedBy) {
    return 0;
  }
  return Object.keys(snapshot.val().likedBy).length;
}

export const updatePost = async (id, content) => {
  await update(ref(db, `posts/${id}`), {
    content: content,
  });
};


export const deletePost = async (postId) => {
  await remove(ref(db, `posts/${postId}`));
  await remove(ref(db, `comments/${postId}`));

}

export const postCommentsCounts = async (postId) => {
  const commentSnapshot = await get(ref(db, `comments/${postId}`));
  if (!commentSnapshot.exists()) {
    return 0;
  }
  const comments = commentSnapshot.val();

  return Object.keys(comments).length;
}

export const editPostTitle = async (postId, newTitle) => {
  await update(ref(db, `posts/${postId}`),
  {title: newTitle});
} 