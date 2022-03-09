# Atividade 1 - Chat com Pub/Sub
O chat utilizando RabbitMQ, mongoDB e express.

## Passos para Executar
criar arquivo .env

DB_USER= "usuario"
DB_PASS= "senha"
SECRET= "senha para o token"

modificar no app.js 176 a config do banco

npm install ou yarn

npm start ou yarn start

post /register
post /login
post /sender/:id
get /chat