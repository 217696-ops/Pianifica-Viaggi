import { Mistral } from '@mistralai/mistralai';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;
const UNSPLASH_ACCESS_KEY_2 = import.meta.env.VITE_UNSPLASH_API_KEY_2;
const UNSPLASH_ACCESS_KEY_3 = import.meta.env.VITE_UNSPLASH_API_KEY_3;
const UNSPLASH_ACCESS_KEY_4 = import.meta.env.VITE_UNSPLASH_API_KEY_4;
const UNSPLASH_KEYS = [
  UNSPLASH_ACCESS_KEY,
  UNSPLASH_ACCESS_KEY_2,
  UNSPLASH_ACCESS_KEY_3,
  UNSPLASH_ACCESS_KEY_4
];
const MISTRAL_TOKEN = import.meta.env.VITE_MISTRAL_TOKEN;

const mistralClient = new Mistral({ apiKey: MISTRAL_TOKEN });

const MODEL_PRIORITY_LIST = [
  "mistral-large-2512",
  "mistral-medium-latest",
  "mistral-small-latest",
  "ministral-14b-2512",
  "ministral-8b-2512",
  "codestral-2508",
  "glm-5-2"
];

export async function getUnsplashImage(query, defaultImage) {
  for(const key of UNSPLASH_KEYS) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${key}`
      );
      const data = await response.json();
      //console.log(response);
      if(!response.ok) {
        console.warn(`Token non valido o limitato, provo il prossimo...`);
        continue; 
      }
      return data.results?.[0]?.urls?.regular || defaultImage;
    } catch (e) {
      console.error(`Errore Unsplash ${key}:`, e);
    }
  }
  return defaultImage;
}

export async function getMistralDescription(promptSys, promptUser) {
  // Cicla attraverso l'elenco dei modelli in ordine di indice (0, 1, 2... n)
  for (let i = 0; i < MODEL_PRIORITY_LIST.length; i++) {
    const currentModel = MODEL_PRIORITY_LIST[i];
    console.log(`[Tentativo ${i + 1}] Modello: ${currentModel}...`);
    try {
      const chatResponse = await mistralClient.chat.complete({
        model: currentModel,
        messages: [
          { role: "system", content: promptSys },
          { role: "user", content: promptUser }
        ],
      });
      console.log(`Il modello "${currentModel}" ha risposto.`);
      return chatResponse.choices[0].message.content;
    } catch (error) {
      console.error("Errore Mistral:", error);
    }
  }
  return "Descrizione non disponibile al momento.";
}

export const fetchCityDescription = (cityName) => getMistralDescription(
  "Sei un esperto di viaggi. Scrivi una descrizione breve e accattivante (massimo 3 frasi brevi) della città fornita, spiegandomi cos'è e facendomi visitare il posto con le parole. Vige il divieto assoluto di utilizzare la formattazione con asterischi singoli o doppi per il grassetto, l'uso di qualsiasi tipo di trattino o lineetta, e l'uso di icone o emoji nel testo. È tassativamente obbligatorio non inventare alcuna informazione nel modo più assoluto. Ogni dettaglio inserito deve basarsi esclusivamente su fatti reali e verificati. Nel caso in cui manchino informazioni sufficienti sulla località fornita, riduci drasticamente la lunghezza del testo o fornisci solo i dati certi piuttosto che inventare dettagli inesistenti.",
  `Parlami di ${cityName}`
);

export const fetchAttractionDescription = (city, attraction) => getMistralDescription(
  "Sei un esperto di viaggi. Scrivi una descrizione breve e accattivante (massimo 3 frasi brevi) dell'attrazione nella città fornita, spiegando cos'è e facendomi visitare il posto con le parole. Vige il divieto assoluto di utilizzare la formattazione con asterischi singoli o doppi per il grassetto, l'uso di qualsiasi tipo di trattino o lineetta, e l'uso di icone o emoji nel testo. È tassativamente obbligatorio non inventare alcuna informazione nel modo più assoluto. Ogni dettaglio descrittivo inserito deve basarsi esclusivamente su fatti reali e verificati. Nel caso in cui manchino informazioni sufficienti sull'attrazione fornita, riduci drasticamente la lunghezza del testo piuttosto che inventare particolari inesistenti.",
  `Parlami di ${attraction} a ${city}`
);

export const fetchFoodDescription = (city, food) => getMistralDescription(
  "Sei un esperto di cucina di tutto il mondo. Scrivi una descrizione breve e accattivante (massimo 3 frasi brevi) del cibo nella città fornita, spiegando cos'è e facendomi assaggiare il piatto con le parole. Vige il divieto assoluto di utilizzare la formattazione con asterischi singoli o doppi per il grassetto, l'uso di qualsiasi tipo di trattino o lineetta, e l'uso di icone o emoji nel testo. È tassativamente obbligatorio non inventare alcuna informazione nel modo più assoluto. Ogni ingrediente, combinazione di sapori e dettaglio culinario inserito deve basarsi esclusivamente su ricette e tradizioni gastronomiche reali. Nel caso in cui manchino informazioni sufficienti sul cibo o sul piatto fornito, riduci drasticamente la lunghezza del testo piuttosto che inventare particolari inesistenti.",
  `Parlami di ${food} in ${city}`
);

export async function generateCityJSON(cityName) {
  const promptSys = `Sei un generatore di dati JSON. Devi generare i dati turistici per una città fornita dall'utente. Vige il divieto assoluto di utilizzare la formattazione con asterischi doppi per il grassetto, l'uso di qualsiasi tipo di trattino o lineetta, e l'uso di icone o emoji nel testo.
Devi rispondere ESCLUSIVAMENTE con un oggetto JSON valido, senza testo prima o dopo, senza formattazione markdown (niente \`\`\`json).
Usa esattamente questa struttura:
{
  "regione": "Nome del continente (Nord America, Sud America, Europa, Asia, Africa, Oceania) o Italia",
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
Inserisci almeno 8-10 attrazioni e 6-8 piatti tipici. Per i valori delle attrazioni metti la stringa "" (così ci penserà l'altro modulo a generarla), per i valori della descrizione della città, delle attrazioni e del cibo metti una stringa vuota "". È tassativamente obbligatorio non inventare alcuna informazione. Ogni singola attrazione e piatto tipico inserito deve esistere realmente nella realtà. Se non ci sono abbastanza dati reali per raggiungere la soglia numerica richiesta, fermati prima piuttosto che inventare elementi inesistenti. L'accuratezza fattuale è prioritaria rispetto al numero di elementi.`;

  try {
    const response = await getMistralDescription(promptSys, `Genera il JSON per la città: ${cityName}`);

    // Mistral a volte aggiunge i backtick del markdown anche se gli diciamo di non farlo.
    // Puliamo la stringa per sicurezza prima di farne il parsing.
    let cleanJsonString = response.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(cleanJsonString);
    return parsedData;
  } catch (error) {
    console.error("Risposta Mistral:", parsedData);
    console.error("Errore nella generazione o nel parsing del JSON:", error);
    return null;
  }
}