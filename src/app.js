import senderMSG from 'sender.js';
import receiverMSG from 'receiver.js';

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Bem vindo ao Chat");
console.log("Escolha 1 para mandar mensagem e 2 para ver mensagem do chat");
readline.question(`What's your name?`, name => {
    console.log(`Hi ${name}!`)
    readline.close()
});





/*
var express = require('express');
var app = express();


const port = 3001;


app.listen(
    port,
    () => console.log(`App on port ${port}!`)
)
*/