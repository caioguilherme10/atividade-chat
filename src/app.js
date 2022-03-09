require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// models
const User = require("./user");
const Sender = require("./sender");

// Config JSON response
app.use(express.json());

function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) return res.status(401).json({ msg: "Acesso negado!" });
  
    try {
      const secret = process.env.SECRET;
  
      jwt.verify(token, secret);
  
      next();
    } catch (err) {
      res.status(400).json({ msg: "O Token é inválido!" });
    }
}

//Criar user
app.post("/register", async (req, res) => {
    const { name, password } = req.body;
  
    // validations
    if (!name) {
      return res.status(422).json({ msg: "O nome é obrigatório!" });
    }
  
    if (!password) {
      return res.status(422).json({ msg: "A senha é obrigatória!" });
    }
  
    // check if user exists
    const userExists = await User.findOne({ name: name });
  
    if (userExists) {
      return res.status(422).json({ msg: "Por favor, utilize outro nome" });
    }
  
    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
  
    // create user
    const user = new User({
      name: name,
      password: passwordHash,
    });
  
    try {
      await user.save();
  
      res.status(201).json({ msg: "Usuário criado com sucesso!" });
    } catch (error) {
      res.status(500).json({ msg: error });
    }
});

//Login
app.post("/login", async (req, res) => {
    const { name, password } = req.body;
  
    // validations
    if (!name) {
      return res.status(422).json({ msg: "O nome é obrigatório!" });
    }
  
    if (!password) {
      return res.status(422).json({ msg: "A senha é obrigatória!" });
    }
  
    // check if user exists
    const user = await User.findOne({ name: name });
  
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }
  
    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password);
  
    if (!checkPassword) {
      return res.status(422).json({ msg: "Senha inválida" });
    }
  
    try {
      const secret = process.env.SECRET;
  
      const token = jwt.sign(
        {
          id: user._id,
        },
        secret
      );
  
      res.status(200).json({ msg: "Autenticação realizada com sucesso!", token });
    } catch (error) {
      res.status(500).json({ msg: error });
    }
});

//mandar mensagem
app.post("/sender/:id", checkToken, async (req, res) => {
    const id = req.params.id;
    const { mensagem } = req.body;
  
    // check if user exists
    const user = await User.findById(id, "-password");
  
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    try {
        Sender(mensagem,user.name);
        res.status(200).json({ msg: "Mensagem enviada com sucesso!"});
    } catch (error) {
        res.status(500).json({ msg: error });
    }
    
});

//chat
app.get("/chat", checkToken, async (req, res) => {

    try {
        const senderamqp = require('amqplib/callback_api');
    
        senderamqp.connect('amqp://localhost', (connError, connection) => {
            if(connError){
                throw connError;
            }
            connection.createChannel((channelError, channel) => {
                if(channelError){
                    throw channelError;
                }
                const QUEUE = 'meuFanout';
                channel.assertQueue(QUEUE, 'fanout');

                let list = [];
            
                channel.consume(QUEUE, (msg) => {
                  console.log(`Mensagens: ${msg.content}`);
                  list.push(msg.content.toString());
                })

                setTimeout(function() {
                  connection.close();
                  res.status(200).json({ msg: list});
                }, 500);
            })
        })
    } catch (error) {
        res.status(500).json({ msg: error });
    }
    
});

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.m7e5h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
).then(() => {
    console.log("Conectou ao banco!");
    app.listen(3001);
}).catch((err) => console.log(err));