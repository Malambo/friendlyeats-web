import "@/src/app/styles.css";
import Header from "@/src/components/Header.jsx";
import {getAuthenticatedAppForUser} from "@/src/lib/firebase/serverApp";
// Force next.js to treat this route as server-side rendered
// Sin esta línea, durante el proceso de construcción, next.js tratará esta ruta como estática y construirá un archivo HTML estático para ella
export const dynamic = "force-dynamic";

export const metadata = {
  title: "FriendlyEats",
  description:
    "FriendlyEats es un sitio web de reseñas de restaurantes creado con Next.js y Firebase.",
};


export default async function RootLayout({children}) {
  const {currentUser} = await getAuthenticatedAppForUser();
  return (
    <html lang="en">

      <body>
            <Header initialUser={currentUser?.toJSON()}/>

        <main>{children}</main>
      </body>

    </html>
  );
}
