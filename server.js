const express = require('express');
const dotenv = require('dotenv');
const tinaRoutes = require('./routes/tina');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Permitir JSON no corpo da requisição

// Rota da Tina
app.use('/api/tina', tinaRoutes);

// Inicializa servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
