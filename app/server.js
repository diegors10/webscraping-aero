const express = require('express');
const { scrapeFlights } = require('./scraping-final'); // Caminho continua correto

const app = express();
app.use(express.json());

// Endpoint para buscar passagens
app.post('/search-flights', async (req, res) => {
  const { client, number, textMessage, origin, destination, departureDate } = req.body;

  if (!client || !number || !textMessage || !origin || !destination || !departureDate) {
    return res.status(400).json({
      error: 'Os campos client, number, textMessage, origin, destination e departureDate são obrigatórios.',
    });
  }

  const [day, month, year] = departureDate.split('/');
  const formattedDate = `${year}-${month}-${day}`;

  try {
    const result = await scrapeFlights({ origin, destination, departureDate: formattedDate });

    return res.json({
      client,
      number,
      textMessage,
      results: result.result,
    });
  } catch (error) {
    console.error('Erro durante a execução do endpoint:', error);
    return res.status(500).json({ error: 'Erro durante o scraping. Tente novamente mais tarde.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
