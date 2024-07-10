const axios = require("axios");

const fetchCards = async (req, res) => {
  const baseApiUrl = `https://api.pokemontcg.io/v2/cards`;
  const apiKey = process.env.POKEMON_TCG_API_KEY;
  const searchTerm = req.params.searchTerm;

  try {
    const response = await axios.get(`${baseApiUrl}?q=name:"${searchTerm}"`, {
      headers: { "X-Api-Key": apiKey },
    });
    const data = await response.data;
    console.log(data);
    const cardsData = data.data;
    res.status(200).json(cardsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong with fetchCards" });
  }
};

module.exports = {
  fetchCards,
};
