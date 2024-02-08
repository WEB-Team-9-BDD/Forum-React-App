import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByUsername = (username) => {

  return get(ref(db, `users/${username}`));
};

export const createUserUsername = (username, firstName, lastName,email, uid ) => {

  return set(ref(db, `users/${username}`), { username, firstName, lastName, uid, email, createdOn: new Date(), likedPosts: {} })
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};