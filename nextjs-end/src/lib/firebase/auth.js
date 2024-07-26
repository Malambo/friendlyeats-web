import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
} from "firebase/auth";

import {auth} from "@/src/lib/firebase/clientApp";

export function onAuthStateChanged(cb) {
	return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
} catch (error) {
    console.error("Error al iniciar sesión con Google", error);
}
}

export async function signOut() {
  try {
    return auth.signOut();
} catch (error) {
    console.error("Error al cerrar sesión con Google", error);
}
}
