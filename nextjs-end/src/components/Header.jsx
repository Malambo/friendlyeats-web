'use client'

import {useState, useEffect} from "react";
import Link from "next/link";
import {
	signInWithGoogle,
	signOut,
	onAuthStateChanged
} from "@/src/lib/firebase/auth.js";
import {addFakeRestaurantsAndReviews} from "@/src/lib/firebase/firestore.js";
import {useRouter} from "next/navigation";
import {firebaseConfig} from "@/src/lib/firebase/config";

function useUserSession(initialUser) {
	// El usuario inicial procede del servidor a través de un componente de servidor
	const [user, setUser] = useState(initialUser);
	const router = useRouter();

	// Registrar el trabajador de servicio que envía el estado de autenticación al servidor
	// El service worker se construye con npm run build-service-worker
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			const serializedFirebaseConfig = encodeURIComponent(JSON.stringify(firebaseConfig));
			const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`
		
		  navigator.serviceWorker
			.register(serviceWorkerUrl)
			.then((registration) => console.log("scope is: ", registration.scope));
		}
	}, []);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged((authUser) => {
			setUser(authUser)
		})

		return () => unsubscribe()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		onAuthStateChanged((authUser) => {
			if (user === undefined) return

			// refrescar cuando el usuario cambie para facilitar las pruebas
			if (user?.email !== authUser?.email) {
				router.refresh()
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	return user;
}

export default function Header({initialUser}) {

	const user = useUserSession(initialUser) ;

	const handleSignOut = event => {
		event.preventDefault();
		signOut();
	};

	const handleSignIn = event => {
		event.preventDefault();
		signInWithGoogle();
	};

	return (
		<header>
			<Link href="/" className="logo">
				<img src="/friendly-eats.svg" alt="FriendlyEats" />
				Friendly Eats
			</Link>
			{user ? (
				<>
					<div className="profile">
						<p>
							<img className="profileImage" src={user.photoURL || "/profile.svg"} alt={user.email} />
							{user.displayName}
						</p>

						<div className="menu">
							...
							<ul>
								<li>{user.displayName}</li>

								<li>
									<a
										href="#"
										onClick={addFakeRestaurantsAndReviews}
									>
										Añadir muestras de restaurantes
									</a>
								</li>

								<li>
									<a href="#" onClick={handleSignOut}>
										Cerrar sesión
									</a>
								</li>
							</ul>
						</div>
					</div>
				</>
			) : (
				<div className="profile">
					<a href="#" onClick={handleSignIn}>
						<img src="/profile.svg" alt="A placeholder user image" />
						Iniciar sesión con Google
					</a>
				</div>
			)}
		</header>
	);
}
