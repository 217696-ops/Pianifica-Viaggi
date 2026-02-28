import { Mistral } from '@mistralai/mistralai';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;
const MISTRAL_TOKEN = import.meta.env.VITE_MISTRAL_TOKEN;

const mistralClient = new Mistral({ apiKey: MISTRAL_TOKEN });

export async function getUnsplashImage(query, defaultImage) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const data = await response.json();
    return data.results?.[0]?.urls?.regular || defaultImage;
  } catch (e) {
    console.error("Errore Unsplash:", e);
    return defaultImage;
  }
}

export async function getMistralDescription(promptSys, promptUser) {
  try {
    const chatResponse = await mistralClient.chat.complete({
      model: "mistral-small-latest",
      messages: [
        { role: "system", content: promptSys },
        { role: "user", content: promptUser }
      ],
    });
    return chatResponse.choices[0].message.content;
  } catch (error) {
    console.error("Errore Mistral:", error);
    return "Descrizione non disponibile al momento.";
  }
}

export const fetchCityDescription = (cityName) => getMistralDescription(
    "Sei un esperto di viaggi. Scrivi una descrizione breve e accattivante (massimo 3 frasi) della città fornita.",
    `Parlami di ${cityName}`
);

export const fetchAttractionDescription = (city, attraction) => getMistralDescription(
    "Sei un esperto di viaggi. Scrivi una descrizione breve e accattivante (massimo 3 frasi) dell'attrazione nella città fornita.",
    `Parlami di ${attraction} in ${city}`
);

export const fetchFoodDescription = (city, food) => getMistralDescription(
    "Sei un esperto di cucina di tutto il mondo. Scrivi una descrizione breve e accattivante (massimo 3 frasi) del cibo nella città fornita, spiegando cos'è e facendomi assagiare il piatto con le parole.",
    `Parlami di ${food} in ${city}`
);