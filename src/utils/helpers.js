export const getRegioni = (db) => {
  const regioni = Object.values(db).map(citta => citta.regione);
  return [...new Set(regioni)].sort();
};

export const getCitta = (db) => {
  return Object.keys(db).sort();
};

export const getCittaByRegione = (db, regione) => {
  return Object.keys(db).sort().filter(nomeCitta => db[nomeCitta].regione === regione);
};

export const creaLinkGoogleMaps = (attrazioni, citta) => {
  const cittaFormattata = citta.replace(/\s/g, '+');
  let link = 'https://www.google.com/maps/dir/';

  attrazioni.forEach((attrazione) => {
    if (!attrazione.toLowerCase().includes('isola')) {
      const attrazioneFormattata = attrazione.replace(/\s/g, '+');
      link += `${attrazioneFormattata},${cittaFormattata}/`;
    }
  });

  return link;
};

export const getDefaultImage = (tipo, regione) => {
  const imageMap = {
    citta: {
      Italia: '../_cityImage/cityImageItalia.jpg',
      Europa: '../_cityImage/cityImageEuropa.jpg',
      Asia: '../_cityImage/cityImageItalia.jpg',
      America: '../_cityImage/cityImage.jpg',
      Africa: '../_cityImage/cityImage.jpg',
      Oceania: '../_cityImage/cityImage.jpg',
      default: '../_cityImage/cityImage.jpg'
    },
    attrazione: {
      Oceania: '../_attractionImage/1.jpg',
      default: [
        '../_attractionImage/1.jpg',
        '../_attractionImage/2.jpg',
        '../_attractionImage/3.jpg',
        '../_attractionImage/4.jpg',
        '../_attractionImage/5.jpg',
        '../_attractionImage/6.jpg',
        '../_attractionImage/7.jpg',
        '../_attractionImage/8.jpg'
        ]
    },
    cibo: {
      Oceania: '../_cityImage/foodImage.jpg',
      Asia: [
        '../_foodImage/Asia1.jpg',
        '../_foodImage/Asia2.jpg',
        '../_foodImage/Asia3.jpg',
        '../_foodImage/Asia4.jpg',
        '../_foodImage/Asia5.jpg',
        '../_foodImage/Asia6.jpg'
      ],
      default: '../_foodImage/foodImage.jpg'
    },
    // Fallback globale se il "tipo" non esiste proprio
    default: '../default.jpg'
  };

  // 1. Seleziona la categoria (es. 'citta'), se non esiste usa il fallback globale
  const categoria = imageMap[tipo] || imageMap.default;

  // Se la categoria è proprio l'immagine di default (stringa), la restituiamo subito
  if (typeof categoria === 'string') return categoria;

  // Recuperiamo il valore associato alla regione
  const risultato = categoria[regione] || categoria.default || imageMap.default;

  // LOGICA CASUALE: Se il risultato è un Array, pesca un indice a caso
  if (Array.isArray(risultato)) {
    const randomIndex = Math.floor(Math.random() * risultato.length);
    return risultato[randomIndex];
  }

  return risultato;
};

export const Citazioni = [
    {
      citazione:"Non è il freddo, è l'umidità che ti ammazza: LE VELINEEE!!!",
      autore:"Ezio Greggio"
    },
    {
      citazione:"Non ci sono più le mezze stagioni",
      autore:"Antonio Vivaldi"
    },
    {
      citazione:"... .- .-.. ..- - .. / -.. .- / -... ..- --. .-.. .. .- -. ---",
      autore:"Samuel Morse"
    },
    {
      citazione:"Il diavolo fa le pentole, ma non i coperchi",
      autore:"Giorgio Mastrota"
    },
    {
      citazione:"Meglio l'erba del vicino che i vicini di Erba",
      autore:"Bruno Vespa"
    },
    {
      citazione:"La non violenza è la più forte arma mai inventata dall'uomo, però...",
      autore:"Mahatma Ghandi"
    },
    {
      citazione:"Vendo Alfa Romeo 147 ottime condizioni. No perditempo",
      autore:"Martin Luther King"
    },
    {
      citazione:"Il mio falegname con 30.000 lire questo sito lo faceva meglio",
      autore:"Nelson Mandela"
    },
    {
      citazione:"Il nuoto è lo sport più completo",
      autore:"Barak Obama"
    },
    {
      citazione:`Se ni' mondo esistesse un po' di bene
      e ognun si honsiderasse suo fratello
      ci sarebbe meno pensieri e meno pene
      ne il mondo ne sarebbe assai più bello`,
      autore:"Pietro Pacciani"
    }
  ];

export const getRandomCitazione = () => {
  const indice = Math.floor(Math.random() * Citazioni.length);
  return Citazioni[indice];
};