const Discord = require('discord.js')
module.exports = (msg) => {
    msg.delete();
    const emb = new Discord.RichEmbed()
        .setTitle('Наша группа Amino')
        .setDescription('[**__Основная инфа тут__**](https://aminoapps.com/c/TF2AminoRUS/home/)')
        //.addField('https://aminoapps.com/c/TF2AminoRUS/home/', '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
        .setThumbnail('http://chittagongit.com/images/teamfortress-2-icon/teamfortress-2-icon-25.jpg')
        .setFooter('Присоединяйся!', 'http://chittagongit.com/images/teamfortress-2-icon/teamfortress-2-icon-25.jpg')
        .setColor('#24ad18');
    msg.channel.send(emb);
    return 0;
}