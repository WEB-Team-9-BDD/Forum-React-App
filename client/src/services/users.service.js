import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db, storage } from '../config/firebase-config';
import { ref as sRef } from 'firebase/storage';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

export const getUserByUsername = async (username) => {

  return get(ref(db, `users/${username}`));
};

export const getUserByEmail = async (email) => {

  return get(ref(db, `users'/${email}`));
};

export const createUser = async (username, firstName, lastName, email, uid, isAdmin, phoneNumber, isBlocked, photoURL) => {

  return set(ref(db, `users/${username}`), { username, firstName, lastName, uid, email, createdOn: Date.now(), likedPosts: {}, isAdmin, phoneNumber, isBlocked,photoURL })
};

export const updateUser = async (username, firstName, lastName, email, uid) => {

  return update(ref(db, `users/${username}`), { username, firstName, lastName, email, uid });
}

export const getUserData = async (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const makeUserAdmin = async (email) => {

  return set(ref(db, `users/${email}/isAdmin`), true);
};

export const updatePhotoURL = async (username, photoURL) => {
  return set(ref(db, `users/${username}/photoURL`), photoURL);
}

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

export const uploadProfilePicture = async (file, user) => {

  const fileRef = sRef(storage, `profile-photos/${user.uid}.png`);
  await uploadBytes(fileRef, file);
  const uploadedPhotoURL = await getDownloadURL(fileRef);
  updateProfile(user, { photoURL: uploadedPhotoURL });

  return uploadedPhotoURL;
}

export const createUserUsername = async (username, firstName, lastName, email, uid, isAdmin, phoneNumber, isBlocked) => {

  return set(ref(db, `users/${username}`), { username, firstName, lastName, uid, email, createdOn: Date.now(), likedPosts: {}, isAdmin, phoneNumber, isBlocked })
};

export const blockUser = async(username) => {

  return set(ref(db, `users/${username}/isBlocked`), true);
};

export const getAllUsers = async () => {
  const snapshot = await get(ref(db, 'users'));
  if (!snapshot.exists()) {
    return [];
  }
  const users = Object.keys(snapshot.val()).map(key => snapshot.val()[key]);
  console.log(users);
  return users;
}