module.exports = function senderMSG(mensagem,nome) {
    //depois colocar nome e data [HH:MM:SS] [<usuário>]: <mensagem>
    const senderamqp = require('amqplib/callback_api');
    //
    senderamqp.connect('amqp://localhost', (connError, connection) => {
        if(connError){
            throw connError;
        }
        connection.createChannel((channelError, channel) => {
            if(channelError){
                throw channelError;
            }
            const QUEUE = 'meuFanout';
            let data = new Date();
            let hora = data.getHours();
            let min = data.getMinutes();        
            let seg = data.getSeconds();
            console.log(`${hora}:${min}:${seg}`);
            let mensagemfinal = `${hora}:${min}:${seg} ${nome}: ${mensagem}`;
            channel.assertQueue(QUEUE, 'fanout', {durable: false});
            channel.sendToQueue(QUEUE, Buffer.from(mensagemfinal));
            console.log(`Mensagem enviada ${mensagemfinal}`);
        })
    })

    /*
    senderamqp.connect('amqp://localhost').then(function(conn) {
        return conn.createChannel().then(function(ch) {
            var QUEUE = 'meuTopic';
            var ok = ch.assertExchange(QUEUE, 'fanout', {durable: false});
            return ok.then(function() {
                ch.publish(QUEUE, Buffer.from(message));
                console.log("Sent", message);
                return ch.close();
            });
        }).finally(function() { conn.close(); })
    }).catch(console.log);
    */
};