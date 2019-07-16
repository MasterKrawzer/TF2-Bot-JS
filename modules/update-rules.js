const fetch = require('fetch')
module.exports = (msg) => {
    fetch.fetchUrl(msg.attachments.array()[0].url, (error, meta, body) => {
        let lines = body.toString().split("\n")
        let emb = new Discord.RichEmbed()
        emb.setTitle('Правила нашего сервера')
        emb.setDescription('**Обязательно к прочтению**')
        emb.setColor('#ff0000');
        
        lines.forEach(l => {
            let params = l.split(';;')
            emb.addField(params[0].trim(), params[1].trim())
        })
        let rulesChan = client.channels.get('599874738269061121');
        // rulesChan.bulkDelete(1, true)
        //     .catch(console.error)
        rulesChan.send(emb)
    })
}