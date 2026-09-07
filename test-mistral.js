import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';

// 1. Carica le variabili d'ambiente (Necessario per Node.js da terminale)
dotenv.config();
const MISTRAL_TOKEN = process.env.VITE_MISTRAL_TOKEN || process.env.VITE_MISTRAL_TOKEN;

const mistralClient = new Mistral({ apiKey: MISTRAL_TOKEN });

// Elenco ordinato dei modelli per priorità (Fallback Cascade)
const MODEL_PRIORITY_LIST = [
  "mistral-large-2512",
  "mistral-medium-latest",
  "mistral-small-latest",
  "ministral-14b-2512",
  "ministral-8b-2512",
  "codestral-2508",
  "glm-5-2" // Nota: Assicurati che questo modello sia supportato dall'SDK Mistral o dalla tua chiave
];

async function getMistralDescription(promptSys, promptUser) {
  // Cicla attraverso l'elenco dei modelli in ordine di indice (0, 1, 2... n)
  for (let i = 0; i < MODEL_PRIORITY_LIST.length; i++) {
    const currentModel = MODEL_PRIORITY_LIST[i];
    console.log(`[Tentativo ${i + 1}/${MODEL_PRIORITY_LIST.length}] Provo ad usare il modello: ${currentModel}...`);

    try {
      const chatResponse = await mistralClient.chat.complete({
        model: currentModel,
        messages: [
          { role: "system", content: promptSys },
          { role: "user", content: promptUser }
        ],
      });

      // Estrazione corretta per la versione recente dell'SDK Mistral
      const testoRisposta = chatResponse.choices[0].message.content;

      console.log(`\n✅ SUCCESSO! Il modello "${currentModel}" ha risposto.`);
      console.log("Risposta ottenuta:", testoRisposta);

      // Restituisce il risultato interrompendo il ciclo
      return testoRisposta;

    } catch (error) {
      console.warn(`⚠️ Il modello "${currentModel}" ha fallito. (Errore: ${error.raw_status_code || error.message || error})`);

      // Se siamo all'ultimo modello della lista e fallisce anche questo, usciamo dal ciclo
      if (i === MODEL_PRIORITY_LIST.length - 1) {
        console.error("\n❌ ERRORE CRITICO: Tutti i modelli configurati nella cascata hanno fallito.");
      } else {
        console.log("Passo al modello successivo di riserva...\n");
      }
    }
  }

  return "Descrizione non disponibile al momento.";
}

// Avvia l'esecuzione del test a cascata
getMistralDescription("Sii un assistente conciso.", "Rispondi solo con la parola 'Funziona!'.");