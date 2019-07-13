const Discord = require("discord.js");
module.exports = (msg) => {
    msg.delete()
        .catch(console.error)
    const emb = new Discord.RichEmbed()
        .setTitle("Группы с мемами про TF2")
        .setDescription("Группы с мемами про TF2 с разных соцсетей")
        .addField('TF2 Subreddit', 'https://www.reddit.com/r/tf2/')
        .addField('TF2 sh*t poster club subreddit', 'https://www.reddit.com/r/tf2shitposterclub/')
        .addField('TF2 VK мемы', 'https://vk.com/tf2_muvikigmod')
        .addField('Мемы про Valve', 'https://vk.com/valvememes')
        .setColor('#f48f42');
    msg.channel.send(emb)
        .then(m => {
            msg.delete()
        })
        .catch(e => console.log(e));
}