import { get, push, update, ref, query, equalTo, orderByChild, runTransaction } from 'firebase/database';
import { db } from '../config/firebase-config';

export const addPost = async (author, title, content) => {
    if (title.length < 16 || title.length > 64) {
        throw new Error('Title must be between 16 and 64 symbols.');
      }
      if (content.length < 32 || content.length > 8192) {
        throw new Error('Content must be between 32 and 8192 symbols.');
      }
    return push (ref(db, 'posts'), {
        author,
        title,
        content,        
        createdOn: Date.now(),
        likes: 0,
        comments: [],
    })
}

export const getAllPosts = async (search, createdBy) => {
    const snapshot = await get(query(ref(db, 'posts'), orderByChild('createdOn')));
    if (!snapshot.exists()) {
        return [];
    }

    const posts = Object.keys(snapshot.val()).map(key => ({
        id: key,
        ...snapshot.val()[key],
        createdOn: new Date(snapshot.val()[key].createdOn).toString(),
        createdBy: snapshot.val()[key].createdBy ? Object.keys(snapshot.val()[key].createdBy) : [],
    }))
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter(p => p.createdBy.includes(createdBy));

    console.log(posts);
    
    return posts;
}

export const getPostById = async (id) => {
    const snapshot = await get(ref(db, `posts/${id}`));
    if (snapshot.exists()) {
        return null;
    }

    const post = {
        id, 
        ...snapshot.val(),
        createdOn: new Date (snapshot.val().createdOn).toString(),
        createdBy: snapshot.val().createdBy ? Object.keys(snapshot.val().createdBy) : [],
    };

    return post;
}

export const likePost = (handle, postId) => {
    const postLike = ref(db, `/posts/${postId}`)
    return runTransaction (postLike, (post) => {
        if(post) {
            if(post.likes){
                post.likes += 1;
            } else {
                post.likes = 1
            }
        }
        return post;
    })
}

export const dislikePost = (handle, postId) => {
    const postDislike = ref(db, `/posts/${postId}`);
    return runTransaction(postDislike, (post) => {
      if (post) {
        if (post.likes && post.likes > 0) {
          post.likes -= 1;
        } else {
          post.likes = 0;
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
    const post = postSnapshot.val();
    post.comments.push({ author, comment, commentedOn: Date.now() });
    return update(ref(db, `posts/${postId}`), post);
  };