const Discord = require('discord.js')
const config = require("../config");
const baseHelp = new Discord.RichEmbed()
    .setTitle('Комманды бота')
    .setDescription('Все комманды начинаются с (!)!')
    .addField('!memes', 'Показывает все паблики с мемами')
    .addField('!report <пользователь> <причина>', 'Отправить жалобу на <пользователя>')
    .addField('!rps <выбор>', 'Поиграть в камень-ножницы-бумага с ботом')
    .addField('!group <название>, <игрок1>, <игрок2> ...>', 'Создать группу с <названием> и <игроками>. В группу входит текстовый и голосовой каналы и никто кроме вас и ваших друзей не может войти в группу. ВНИМАТЕЛЬНО С ЗАПЯТЫМИ!')
    .addField('!remove', 'Удаляет группу если таковая имеется.')
    .setThumbnail('https://cdn.icon-icons.com/icons2/1155/PNG/512/1486564730-gears-cogs_81537.png')
    .setFooter('Не забудь про (!)!')
    .setColor('#ff0000');

module.exports = (msg) => {
    if (msg.member.roles.has(config.adminRole)) {
        msg.author.send(baseHelp);
        const emb = new Discord.RichEmbed()
            .setTitle('Эксклюзивные команды админа')
            .setTitle('Доступны всем пользователям с ролью `Админ`')
            .addField('!update-rules', '**Обновить правила в соостветсвии с кодом**')
            .addField('!send-news', '**Отправить новость в новостной чат** *За помощью с синтаксииом этой комманды писать .helpnews.*')
            .addField('!delete <кол-во_сообщений>', '**Удалить определённое количество сообщений из канала (до 100 за раз (не удаляет сообщения старше 14 дней))**')
            .setColor('#ffff00')
            .setFooter('Команды хоть и обрабатываются на наличие роли, но просьба держать их в секрете!');
        msg.author.send(emb);
        msg.delete();
    } else if (msg.member.roles.has(config.moderatorRole)) {
        msg.author.send(baseHelp);
        const emb = new Discord.RichEmbed()
            .setTitle('Эксклюзивные команды модератора')
            .setTitle('Доступны всем пользователям с ролью `Модератор`')
            .addField('!send-news', '**Отправить новость в новостной чат** *За помощью с синтаксисом этой комманды писать .helpnews.*')
            .addField('!delete <кол-во_сообщений>', '**Удалить определённое количество сообщений из канала (до 100 за раз (не удаляет сообщения старше 14 дней))**')
            .setColor('#2cc061')
            .setFooter('Команды хоть и обрабатываются на наличие роли, но просьба держать их в секрете!');
        msg.author.send(emb);
        msg.delete();
    } else if (msg.member.roles.has(config.curatorRole)) {
        msg.author.send(baseHelp);
        const emb = new Discord.RichEmbed()
            .setTitle('Эксклюзивные команды куратора')
            .setTitle('Доступны всем пользователям с ролью `Куратоор`')
            .addField('.send-news', '**Отправить новость в новостной чат** *За помощью с синтаксииом этой комманды писать .helpnews.*')
            .setColor('#82201b')
            .setFooter('Команды хоть и обрабатываются на наличие роли, но просьба держать их в секрете!');
        msg.author.send(emb);
        msg.delete();
    } else {
        msg.author.send(baseHelp);
        msg.delete()
    }
    return 0;
}