import Restaurant from "@/src/components/Restaurant.jsx";
import {Suspense} from "react";
import {getRestaurantById} from "@/src/lib/firebase/firestore.js";
import {getAuthenticatedAppForUser, getAuthenticatedAppForUser as getUser} from "@/src/lib/firebase/serverApp.js";
import ReviewsList, {
  ReviewsListSkeleton,
} from "@/src/components/Reviews/ReviewsList";
import {getFirestore} from "firebase/firestore";

export default async function Home({params}) {
  const {currentUser} = await getUser();
  const {firebaseServerApp} = await getAuthenticatedAppForUser();
  const restaurant = await getRestaurantById(getFirestore(firebaseServerApp), params.id);

  return (
    <main className="main__restaurant">
      <Restaurant
        id={params.id}
        initialRestaurant={restaurant}
        initialUserId={currentUser?.uid || ""}
      >
      </Restaurant>
      <Suspense
        fallback={<ReviewsListSkeleton numReviews={restaurant.numRatings} />}
      >
        <ReviewsList restaurantId={params.id} userId={currentUser?.uid || ""} />
      </Suspense>
    </main>
  );
}
