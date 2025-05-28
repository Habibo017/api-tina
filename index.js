const supabase = require('./supabaseClient')
const axios = require('axios')
const dotenv = require('dotenv')
const { userInfo } = require('os')
dotenv.config()

async function getConversationId(userId) {
  const { data, error } = await supabase
  .from('conversations')
  .select('conversation_id')
  .eq('user_id', userId)
  .single();


  return data?.conversation_id || null
}

//funcao para salvar o conversation id no supabase
 async function saveConversationId(userId, conversationId){
   await supabase
   .from('conversations')
   .upsert({
     user_id: userId,
     conversation_id: conversationId
   })
 }

//funcao da tina

async function getTinaResponse(userId, message) {
  try {
    let conversationId = await getConversationId(userId)
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
    }
 )

    const newConversationId = response.data.conversation_id;
    if (newConversationId && !conversationId) {
      await saveConversationId(userId, newConversationId);
    }
    return response.answer
  } catch (error) {
    console.error('Erro ao se comunicar com a Dify:', error.response?.data || error.message);
    return 'Desculpe, não consegui obter a resposta da Dify.';
  }
}

//monitorar as mensagens no terminal
const userid = userInfo().uid
const username = userInfo().username
const messageText = userInput

if(messageText){
  const respostaTina = await getTinaResponse(username, messageText)

  const now = new Date();
  const format = (v) => String(v).padStart(2, '0');
  const day = format(now.getDate());
  const month = format(now.getMonth() + 1);
  const year = now.getFullYear();
  const hour = format(now.getHours());
  const minute = format(now.getMinutes());
  const second = format(now.getSeconds());

  console.log('===== TINA IA =======');
  console.log(`|-> ID: ${userid}`)
  console.log(`|-> Usuario: ${username}`)
  console.log(`|-> Mensagem: ${messageText}`)
  console.log(`|-> Resposta: ${respostaTina}`)
  console.log(`|-> Data: ${day}/${month}/${year}`)
  console.log(`|-> Hora: ${hour}:${minute}:${second}`)
  console.log('======================');
}