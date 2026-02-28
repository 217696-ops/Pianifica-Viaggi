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