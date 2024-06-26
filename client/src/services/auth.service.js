import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase-config';

export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

// export const isLoggedIn = () => {
//   return new Promise((resolve) => {
//     onAuthStateChanged(auth, user => {
//       if (user) {
//         resolve(true);
//       } else {
//         resolve(false);
//       }
//     });
//   });
// };