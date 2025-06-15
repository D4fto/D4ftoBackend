require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const webhookURL = process.env.WEBHOOKURL

function isUUIDv4(str) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(str);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(cors());

app.post('/sendMessage', (req, res) => {
    const userId = req.body.userId
    if(!isUUIDv4(userId)){
        return res.status(400).send('UUID inválido');
    }
    const data = {
        content: `Acessaram meu portfólio ${new Date().toLocaleString()} : ${userId}\n----------------------------------------------------`
    };
    fetch(webhookURL, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then((response)=>{
        if(!response.ok){
            const error = new Error('Erro HTTP');
            error.status = response.status;
            throw error;
        }
        res.status(200).send('Mensagem enviada');
    })
    .catch((error) => {
        const status = error.status || 500;
        res.status(status).send('Erro: ' + error.message);
    });
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});