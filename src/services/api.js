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
  "Sei un esperto di viaggi. Scrivi una descrizione breve e accattivante (massimo 3 frasi) della città fornita, spiegandomi cos'è e facendomi visitare il posto con le parole.",
  `Parlami di ${cityName}`
);

export const fetchAttractionDescription = (city, attraction) => getMistralDescription(
  "Sei un esperto di viaggi. Scrivi una descrizione breve e accattivante (massimo 3 frasi) dell'attrazione nella città fornita, spiegando cos'è e facendomi visitare il posto con le parole.",
  `Parlami di ${attraction} a ${city}`
);

export const fetchFoodDescription = (city, food) => getMistralDescription(
  "Sei un esperto di cucina di tutto il mondo. Scrivi una descrizione breve e accattivante (massimo 3 frasi) del cibo nella città fornita, spiegando cos'è e facendomi assagiare il piatto con le parole.",
  `Parlami di ${food} in ${city}`
);

export async function generateCityJSON(cityName) {
  const promptSys = `Sei un generatore di dati JSON. Devi generare i dati turistici per una città fornita dall'utente.
Devi rispondere ESCLUSIVAMENTE con un oggetto JSON valido, senza testo prima o dopo, senza formattazione markdown (niente \`\`\`json).
Usa esattamente questa struttura:
{
  "regione": "Nome del continente o Italia",
  "nazione": "codice nazione 2 lettere minuscole (es. it, fr, us)",
  "descrizione": "",
  "attrazioni": {
    "Nome Attrazione 1": "",
    "Nome Attrazione 2": "",
    "Nome Attrazione 3": ""
  },
  "cibo": {
    "Piatto tipico 1": "",
    "Piatto tipico 2": "",
    "Piatto tipico 3": ""
  }
}
Inserisci almeno 8-10 attrazioni e 6-8 piatti tipici. Per i valori delle attrazioni metti la stringa "Descrizione" (così ci penserà l'altro modulo a generarla), per i valori del cibo metti una stringa vuota "".`;

  try {
    const response = await getMistralDescription(promptSys, `Genera il JSON per la città: ${cityName}`);

    // Mistral a volte aggiunge i backtick del markdown anche se gli diciamo di non farlo.
    // Puliamo la stringa per sicurezza prima di farne il parsing.
    let cleanJsonString = response.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(cleanJsonString);
    return parsedData;
  } catch (error) {
    console.error("Errore nella generazione o nel parsing del JSON:", error);
    return null;
  }
}