// tina.js
const supabase = require('../supabaseClient');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Buscar conversation_id salvo no Supabase
async function getConversationId(userId) {
  const { data, error } = await supabase
    .from('conversations')
    .select('conversation_id')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Erro ao buscar conversation_id:', error.message);
    return null;
  }

  return data?.conversation_id || null;
}

// Salvar conversation_id no Supabase
async function saveConversationId(userId, conversationId) {
  const { error } = await supabase
    .from('conversations')
    .upsert({
      user_id: userId,
      conversation_id: conversationId
    });

  if (error) {
    console.error('Erro ao salvar conversation_id:', error.message);
  }
}

// Função principal para enviar mensagem à Tina (via Dify)
async function getTinaResponse(userId, message) {
  try {
    let conversationId = await getConversationId(userId);

    const response = await axios.post('https://api.dify.ai/v1/chat-messages', {
      user: String(userId),
      query: message,
      response_mode: 'blocking',
      conversation_id: conversationId,
      inputs: {}
    }, {
      headers: {
        Authorization: `Bearer ${process.env.TINA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const newConversationId = response.data.conversation_id;

    if (newConversationId && !conversationId) {
      await saveConversationId(userId, newConversationId);
    }

    return response.data.answer;
  } catch (error) {
    console.error('Erro ao se comunicar com a Dify:', error.response?.data || error.message);
    return 'Desculpe, não consegui obter a resposta da Tina.';
  }
}

// Exportar a função para ser usada em outros arquivos
module.exports = {
  getTinaResponse
};
