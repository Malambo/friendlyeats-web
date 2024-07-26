// impone que este código sólo puede ser llamado en el servidor
// Ahora, cualquier componente cliente que importe funciones del
// servidor recibirá un error de compilación explicando que este
// módulo sólo puede utilizarse en el servidor.
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment

import "server-only";

import { headers } from "next/headers";
import { initializeServerApp } from "firebase/app";

import { firebaseConfig } from "./config";
import { getAuth } from "firebase/auth";

export async function getAuthenticatedAppForUser() {
  throw new Error('not implemented');
}
