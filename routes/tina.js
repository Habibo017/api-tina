const express = require('express');
const router = express.Router();
const { getTinaResponse } = require('../api/tina');

// POST /api/tina/message
router.post('/message', async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'Parâmetros userId e message são obrigatórios.' });
  }

  const response = await getTinaResponse(userId, message);
  res.json({ answer: response });
});

module.exports = router;
