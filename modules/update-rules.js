const fetch = require('fetch')
const Discord = require('discord.js')
module.exports = (msg, client) => {
    fetch.fetchUrl(msg.attachments.array()[0].url, (error, meta, body) => {
        let lines = body.toString().split("::")
        let emb = new Discord.RichEmbed()
        emb.setTitle('Правила нашего сервера')
        emb.setDescription('**Обязательно к прочтению**')
        emb.setColor('#ff0000');
        
        lines.forEach(l => {
            let params = l.split(';;')
            emb.addField(params[0].trim(), params[1].trim())
        })
        let rulesChan = client.channels.get('602176864223494164');
        // rulesChan.bulkDelete(1, true)
        //     .catch(console.error)
        rulesChan.send(emb)
    })
}