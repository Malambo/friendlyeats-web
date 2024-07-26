const {GoogleGenerativeAI} = require("@google/generative-ai");
import {getReviewsByRestaurantId} from "@/src/lib/firebase/firestore.js";
import {getAuthenticatedAppForUser} from "@/src/lib/firebase/serverApp";
import {getFirestore} from "firebase/firestore";

export async function GeminiSummary({restaurantId}) {
  const {firebaseServerApp} = await getAuthenticatedAppForUser();
  const reviews = await getReviewsByRestaurantId(
    getFirestore(firebaseServerApp),
    restaurantId
  );

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({model: "gemini-pro"});

  const reviewSeparator = "@";
  const prompt = `
    Based on the following restaurant reviews, 
    where each review is separated by a '${reviewSeparator}' character, 
    create a one-sentence summary of what people think of the restaurant. 
    
    Here are the reviews: ${reviews.map(review => review.text).join(reviewSeparator)}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return (
      <div className="restaurant__review_summary">
        <p>{text}</p>
        <p>✨ Resumido con Gemini</p>
      </div>
    );
} catch (e) {
    console.error(e);
    if (e.message.includes("403 Forbidden")) {
      return (
        <p>
          Esta cuenta de servicio no tiene permiso para hablar con Gemini a través de
          Vertex
        </p>
      );
 } else {
      return <p>Error al contactar con Gemini</p>;
 }
}
}

export function GeminiSummarySkeleton() {
  return (
    <div className="restaurant__review_summary">
      <p>✨ Resumiendo reseñas con Géminis...</p>
    </div>
  );
}
