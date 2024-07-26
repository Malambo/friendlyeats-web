import RestaurantListings from "@/src/components/RestaurantListings.jsx";
import {getRestaurants} from "@/src/lib/firebase/firestore.js";
import {getAuthenticatedAppForUser} from "@/src/lib/firebase/serverApp.js";
import {getFirestore} from "firebase/firestore";

// Fuerza a next.js a tratar esta ruta como renderizada del lado del servidor
// Sin esta línea, durante el proceso de construcción, next.js tratará esta ruta como estática y construirá un archivo HTML estático para ella
export const dynamic = "force-dynamic";

// Esta línea también fuerza a esta ruta a ser renderizada del lado del servidor
// export const revalidate = 0;

export default async function Home({searchParams}) {
	// El uso de seachParams que proporciona Next.js permite, por ejemplo, que el filtrado se realice en el lado del servidor:
	// ?city=London&category=Indian&sort=Review
	const {firebaseServerApp} = await getAuthenticatedAppForUser();
	const restaurants = await getRestaurants(getFirestore(firebaseServerApp), searchParams);
	return (
		<main className="main__home">
			<RestaurantListings
				initialRestaurants={restaurants}
				searchParams={searchParams}
			/>
		</main>
	);
}
