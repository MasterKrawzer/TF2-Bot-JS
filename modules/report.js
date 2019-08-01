const Discord = require('discord.js')
module.exports = (msg, client, args) => {
    const service = client.channels.get('575395400282931201');
    let user = msg.mentions.users.first();
    if (!user) {
        msg.reply('Не смог найти пользователя!')
        return 1;
    }
    args.shift();
    let reason = args.join(' ').trim();
    if (!reason) {
        msg.reply('Не указана причина жалобы!')
        return 1;
    }
    msg.channel.send(`Была подана жалоба на пользователя ${user.tag}. Приятного дня!)`)
        .catch((e) => console.log(e));
    msg.delete();
    const emb = new Discord.RichEmbed()
        .setTitle('Жалоба на игрока')
        .setDescription('Не нравится чот')
        .addField('Кто?', `**Пользователь: ${user.tag}**`)
        .addField('За что?', `**Причина: ${reason}**`)
        .setColor('#ff7b00')
        .setFooter('Просьба принять меры');
    service.send(emb)
        .then(async msg => {
            await msg.react('✅')
            msg.react('❌')
        })
        .catch(e => {
            console.error()
            msg.reply('Не смог подать жалобу на игрока!');
            return 1;
        })
    return 0;
}