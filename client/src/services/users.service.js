import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByUsername = (username) => {

  return get(ref(db, `users/${username}`));
};

export const getUserByEmail = (email) => {
  
    return get(ref(db, `users'/${email}`));
};

export const createUserUsername = (username, firstName, lastName,email, uid, isAdmin, phoneNumber,isBlocked ) => {

  return set(ref(db, `users/${username}`), { username, firstName, lastName, uid, email, createdOn: Date.now(), likedPosts: {}, isAdmin, phoneNumber, isBlocked })
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const makeUserAdmin = (email) => {

  return set(ref(db, `users/${email}/isAdmin`), true);
};

export const blockUser = (username) => {

  return set(ref(db, `users/${username}/isBlocked`), true);
};

export const usersCount = async () => {
  const snapshot = await get(ref(db, 'users'));
  if (!snapshot.exists()) {
    return 0;
  }
  return Object.keys(snapshot.val()).length;
}

export const getUserDataByUsername = async (username) => {
  const snapshot = await get(ref(db, `users/${username}`));
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.val();
}

export const getAllUsers = async () => {
  const snapshot = await get(ref(db, 'users'));
  if (!snapshot.exists()) {
    return [];
  }
  const users = Object.keys(snapshot.val()).map(key => snapshot.val()[key]);
  console.log(users);
  return users;
}