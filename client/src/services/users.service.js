import { get, set, ref, query, equalTo, orderByChild, push } from 'firebase/database';
import { db, storage } from '../config/firebase-config';
import { ref as sRef } from 'firebase/storage';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

export const getUserByUsername = (username) => {

  return get(ref(db, `users/${username}`));
};

export const getUserByEmail = (email) => {

  return get(ref(db, `users'/${email}`));
};

export const createUser = (username, firstName, lastName, email, uid, isAdmin, phoneNumber) => {

  return set(ref(db, `users/${username}`), { username, firstName, lastName, uid, email, createdOn: Date.now(), likedPosts: {}, isAdmin, phoneNumber })
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const makeUserAdmin = (email) => {

  return set(ref(db, `users/${email}/isAdmin`), true);
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

export const uploadProfilePicture = async (file, user) => {

  const fileRef = sRef(storage,`images/${user.uid}.png`);
  await uploadBytes(fileRef, file);

  const uploadedPhotoURL = await getDownloadURL(fileRef);
  updateProfile(user, { photoURL: uploadedPhotoURL });

  console.log('Suppose to be uploaded');
}
