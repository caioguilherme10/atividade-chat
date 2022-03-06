function receiverMSG() {
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
            channel.assertQueue(QUEUE, 'fanout');
            
            channel.consume(QUEUE, (msg) => {
                console.log(`Mensagens: ${msg.content}`);
                return msg.content;
            })
        })
    })
    //
    /*
    
    */
};

export default receiverMSG;