const axios = require('axios');

axios.post('http://localhost:3000/api/tina/message', {
  userId: 'usuario123',
  message: 'Oi Tina, tudo bem?'
})
.then(res => {
  console.log('Resposta da Tina:', res.data);
})
.catch(err => {
  console.error('Erro:', err.response?.data || err.message);
});
