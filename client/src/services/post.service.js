import {
  get,
  push,
  set,
  onValue,
  // update,
  ref,
  query,  
  orderByChild,
  runTransaction,
} from 'firebase/database';
import { db } from '../config/firebase-config';

export const addPost = async (author, title, content) => {
  return push(ref(db, 'posts'), {
    author,
    title,
    content,
    createdOn: Date.now(),
    likes: 0,
    dislikes: 0,
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
    }));

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
  };

  return post;
};

export const likePost = (postId) => {
  const postLike = ref(db, `/posts/${postId}`);
  return new Promise((resolve, reject) => {
    runTransaction(postLike, (post) => {
      if (post) {
        post.likes = (typeof post.likes === 'number' ? post.likes : 0) + 1;
      }
      return post;
    }).then(resolve).catch(reject);
  });
};

export const dislikePost = (postId) => {
  const postDislike = ref(db, `/posts/${postId}`);
  return new Promise((resolve, reject) => {
    runTransaction(postDislike, (post) => {
      if (post) {
        post.dislikes = (typeof post.dislikes === 'number' ? post.dislikes : 0) + 1;
      }
      return post;
    }).then(resolve).catch(reject);
  });
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

// export const getCommentsCount = async (postId) => {
//   const postSnapshot = await get(ref(db, `posts/${postId}`));
//   if (!postSnapshot.exists()) {
//     throw new Error('Post not found.');
//   }
//   const post = postSnapshot.val();
//   post.comments.push({ author, comment, commentedOn: Date.now() });
//   return update(ref(db, `posts/${postId}`), post);
// };

export const getCommentsCount = async (postId) => {
  const postSnapshot = await get(ref(db, `posts/${postId}`));
  if (!postSnapshot.exists()) {
    throw new Error('Post not found.');
  }
  const post = postSnapshot.val();
  console.log(post.comment);
  return post.comments ? Object.keys(post.comments).length : 0;
};

export const postCount = async () => {
  const snapshot = await get(ref(db, 'posts'));
  if (!snapshot.exists()) {
    return 0;
  }
  return Object.keys(snapshot.val()).length;
}