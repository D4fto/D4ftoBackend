require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const app = express();
const webhookURL = process.env.WEBHOOKURL;


function isUUIDv4(str) {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(str);
}

app.use(cors({
  origin: "https://d4fto.github.io",
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5, 
  standardHeaders: true,
  legacyHeaders: false,
});


const sentUsers = new Set();


app.post('/sendMessage', analyticsLimiter, async (req, res) => {
  const { userId } = req.body;

  if (!isUUIDv4(userId)) {
    return res.status(400).send('UUID inválido');
  }

 
  if (sentUsers.has(userId)) {
    return res.status(200).send('Já registrado');
  }

  sentUsers.add(userId);

  
  res.status(200).send('Recebido');

  
  try {
    await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `📊 Acessaram meu portfólio
🕒 ${new Date().toLocaleString()}
🆔 ${userId}
----------------------------------`,
      }),
    });
  } catch (err) {
    console.error('Erro no webhook:', err.message);
  }
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
