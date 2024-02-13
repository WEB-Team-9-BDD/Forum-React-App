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
    }))
    .filter((post) => post.title.toLowerCase().includes(search.toLowerCase()));


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
  return runTransaction(postLike, (post) => {
    if (post) {
      if (post.likes) {
        post.likes += 1;
      } else {
        post.likes = 1;
      }
    }
    return post;
  });
};

export const dislikePost = (postId) => {
  const postDislike = ref(db, `/posts/${postId}`);
  return runTransaction(postDislike, (post) => {
    if (post) {
      if (post.dislikes) {
        post.dislikes += 1;
      } else {
        post.dislikes = 1;
      }
    }
    return post;
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
  return post.comments.length;
};

export const postCount = async () => {
  const snapshot = await get(ref(db, 'posts'));
  if (!snapshot.exists()) {
    return 0;
  }
  return Object.keys(snapshot.val()).length;
}