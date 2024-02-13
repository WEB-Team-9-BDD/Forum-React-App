import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByUsername = (username) => {

  return get(ref(db, `users/${username}`));
};

export const getUserByEmail = (email) => {
  
    return get(ref(db, `users'/${email}`));
};

export const createUserUsername = (username, firstName, lastName,email, uid ) => {

  return set(ref(db, `users/${username}`), { username, firstName, lastName, uid, email, createdOn: Date.now(), likedPosts: {} })
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const makeUserAdmin = (email) => {

  return set(ref(db, `users/${email}/isAdmin`), true);
};