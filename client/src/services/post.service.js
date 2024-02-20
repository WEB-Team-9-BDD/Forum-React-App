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
  remove,
  equalTo
} from 'firebase/database';
import { db } from '../config/firebase-config';
import { postCategories } from '../constants/postCategories';

export const addPost = async (author, title, content, category, tagRefs) => {
  return push(ref(db, 'posts'), {
    author,
    title,
    content,
    category,
    createdOn: Date.now(),
    comments: [],
    tags: tagRefs,
  });
};

export const getAllPosts = async (createdBy) => {
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
      category: snapshot.val()[key].category, // new category field
      createdOn: new Date(snapshot.val()[key].createdOn).toString(),
      createdBy: snapshot.val()[key].createdBy
        ? Object.keys(snapshot.val()[key].createdBy)
        : [],
    }))

  return posts;
};

export const getPostsByCategory = async (category) => {
  const categoryTitle = postCategories.find(cat => cat.path === `/${category}`).title;
  
  const snapshot = await get(
    query(ref(db, 'posts'), orderByChild('category'), equalTo(categoryTitle))
  );
  
  if (!snapshot.exists()) {
    return [];
  }

  const posts = Object.keys(snapshot.val())
    .map((key) => ({
      id: key,
      ...snapshot.val()[key],
      category: snapshot.val()[key].category,
      createdOn: new Date(snapshot.val()[key].createdOn).toString(),
      createdBy: snapshot.val()[key].createdBy
        ? Object.keys(snapshot.val()[key].createdBy)
        : [],
    }));

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
    category: snapshot.val().category, // new category field
    createdOn: new Date(snapshot.val().createdOn).toString(),
    createdBy: snapshot.val().createdBy
      ? Object.keys(snapshot.val().createdBy)
      : [],
    likedBy: snapshot.val().likedBy ? Object.keys(snapshot.val().likedBy) : [],
    dislikedBy: snapshot.val().dislikedBy ? Object.keys(snapshot.val().dislikedBy) : [],
    // tags: await Promise.all(snapshot.val().tags.map(getTagById)),
  };

  return post;
};

const getTagById = async (id) => {
  const snapshot = await get(ref(db, `tags/${id}`));
  return snapshot.val();
};

export const isPostLikedByUser = async (username, postId) => {
  const snapshot = await get(ref(db, `/posts/${postId}/likedBy/${username}`));
  return snapshot.val() === true;
};


export const likePost = async (username, postId) => {
  const updates = {};
  updates[`/posts/${postId}/likedBy/${username}`] = true;
  updates[`/users/${username}/likedPosts/${postId}`] = true;

  await update(ref(db), updates);

  await remove(ref(db, `/posts/${postId}/dislikedBy/${username}`));
  await remove(ref(db, `/users/${username}/dislikedPosts/${postId}`));
};

export const unlikePost = async (username, postId) => {
  const postRef = ref(db, `posts/${postId}/likedBy/${username}`);
  await remove(postRef);
};

export const dislikePost = async (username, postId) => {
  const updates = {};
  updates[`/posts/${postId}/dislikedBy/${username}`] = true;
  updates[`/users/${username}/dislikedPosts/${postId}`] = true;

  await update(ref(db), updates);

  await remove(ref(db, `/posts/${postId}/likedBy/${username}`));
  await remove(ref(db, `/users/${username}/likedPosts/${postId}`));
};

export const undislikePost = async (username, postId) => {
  const postRef = ref(db, `posts/${postId}/dislikedBy/${username}`);
  await remove(postRef);
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

export async function getCommentsCount(postId) {
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

      resolve(comments.length);
    }, (error) => {
      reject(error);
    });
  });
}

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

export const dislikeCount = async (postId) => {
  const snapshot = await get(ref(db, `posts/${postId}`));
  if (!snapshot.exists() || !snapshot.val().dislikedBy) {
    return 0;
  }
  return Object.keys(snapshot.val().dislikedBy).length;
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
    { title: newTitle });
}

export const getPostsByAuthor = async (author) => {
  const snapshot = await get(
    query(ref(db, 'posts'), orderByChild('author'))
  );
  if (!snapshot.exists()) {

    return [];
  }

  const posts = Object.keys(snapshot.val())
    .map((key) => ({
      id: key,
      ...snapshot.val()[key],
      category: snapshot.val()[key].category, // new category field
      createdOn: new Date(snapshot.val()[key].createdOn).toString(),
      createdBy: snapshot.val()[key].createdBy
        ? Object.keys(snapshot.val()[key].createdBy)
        : [],
    }))
    .filter((post) => post.author === author);

  return posts;
}

export const addTag = async (tag) => {
  return set(ref(db, `tags/${tag}`), { name: tag });
};

export const addTagToPost = async (postId, tag) => {
  // Check if the tag is valid
  if (!tag || tag.length > 10) {
    console.log('Invalid tag');
    return;
  }

  // Check if the tag exists
  const tagRef = ref(db, `tags/${tag}`);
  const tagSnapshot = await get(tagRef);

  if (!tagSnapshot.exists()) {
    // If the tag does not exist, create it
    await addTag(tag); // use addTag function
  }

  // Add the tag to the post
  const postTagRef = ref(db, `posts/${postId}/tags/${tag}`);
  await set(postTagRef, true);
};

export async function getTagsByPostId(postId) {
  const tagsRef = ref(db, `posts/${postId}/tags`);

  return new Promise((resolve, reject) => {
    onValue(tagsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        resolve([]);
        return;
      }

      // If data is already an array, just resolve it directly
      resolve(data);
    }, (error) => {
      reject(error);
    });
  });
}