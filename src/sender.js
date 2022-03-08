function senderMSG(mensagem,nome) {
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
            let data = Date.now();
            let mensagemfinal = `${data} ${nome}: ${mensagem}`;
            channel.assertQueue(QUEUE, 'fanout', {durable: false});
            channel.sendToQueue(QUEUE, Buffer.from(mensagem));
            console.log(`Mensagem enviada ${mensagemfinal}`);
        })
    })
    //
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

export default senderMSG;