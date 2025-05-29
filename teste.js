const axios = require('axios');

axios.post('https://api-tina.onrender.com/api/tina/message', {
  userId: 'usuario123',
  message: 'Oi Tina, tudo bem?'
})
.then(res => {
  console.log('Resposta da Tina:', res.data);
})
.catch(err => {
  console.error('Erro:', err.response?.data || err.message);
});
