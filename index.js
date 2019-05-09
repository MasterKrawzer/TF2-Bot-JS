"use strict";
const Discord = require("discord.js");
const Token = require("/Users/alexeytkachenko/Documents/GitHub/discordtoken.json");
const config = require("./config.json");
const fs = require('fs');

const client = new Discord.Client;

const defaultcolor = '#4F545C';
var playingRps;
var rpsUser;
var rpsScore;
var rpsUSC;
var rpsBSC;

var rpsArr = ['камень', 'ножницы', 'бумага'];

const baseHelp = new Discord.RichEmbed()
    .setTitle('Комманды бота')
    .setDescription('Все комманды начинаются с точки (.)!')
    .addField('.memes', 'Показывает все паблики с мемами')
    .addField('.amino', 'Показывает ссылку на наш Амино :)')
    .addField('.report', 'Отправить жалобу на игрока')
    .setThumbnail('https://cdn.icon-icons.com/icons2/1155/PNG/512/1486564730-gears-cogs_81537.png')
    .setFooter('Не забудь про точку!')
    .setColor('#ff0000');

function colorAnalyser(tcolor) {
    switch (tcolor) {
        case 'red':
            return '#ff0000';
        case 'green':
            return '#00e100';
        case 'blue':
            return '#0000ff';
        case 'black':
            return '#000000';
        case 'white':
            return '#ffffff';
        case 'lightblue':
            return '#add8e6';
        case 'pink':
            return '#ffc0cb';
        default:
            return defaultcolor;
    }
}

client.on("ready", () => {
    console.log(`Connected as ${client.user.tag}`);
    client.user.setActivity("за тобой ( ͡° ͜ʖ ͡°)", { type: "WATCHING" });

});

client.login(Token.token)
    .catch(console.error);

client.on("message", async msg => {
    if (msg.author.bot) return;

    if (msg.content.startsWith(config.prefix) == false) return;

    var args = msg.content.split(" "); //create args array
    let command = args[0].slice(1); //get the clear command for the args and clear it of the prefix
    args.shift(); //delete args's first element (the command)
    var users = client.users.array;
    var sArgs = args.join(" "); //join what's left of the args into one string

    if (command === "test") {
        msg.channel.send(`Hello ${msg.author.tag}!`); //Test command that sends "Hello + user's tag"
    }

    if (command == "ping") {
        const m = await msg.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. Bot's Latency is ${Math.round(client.ping)}ms.`); //Ping command that calculates bot's ping
    }

    if (command === "memes") { //send embed message with links to TF2 meme reddit/VK communities
        msg.delete();
        const emb = new Discord.RichEmbed()
            .setTitle("Группы с мемами про TF2")
            .setDescription("Группы с мемами про TF2 с разных соцсетей")
            .addField('TF2 Subreddit', 'https://www.reddit.com/r/tf2/')
            .addField('TF2 sh*t poster club subreddit', 'https://www.reddit.com/r/tf2shitposterclub/')
            .addField('TF2 VK мемы', 'https://vk.com/tf2_muvikigmod')
            .addField('Мемы про Valve', 'https://vk.com/valvememes')
            .setColor('#f48f42');
        msg.channel.send(emb);
    }
    if (command === "amino") { //same thing like above but about our russian TF2 amino community
        msg.delete();
        const emb = new Discord.RichEmbed()
            .setTitle('Наша группа Amino')
            .setDescription('[**__Основная инфа тут__**](https://aminoapps.com/c/TF2AminoRUS/home/)')
            //.addField('https://aminoapps.com/c/TF2AminoRUS/home/', '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
            .setThumbnail('http://chittagongit.com/images/teamfortress-2-icon/teamfortress-2-icon-25.jpg')
            .setFooter('Присоединяйся!', 'http://chittagongit.com/images/teamfortress-2-icon/teamfortress-2-icon-25.jpg')
            .setColor('#24ad18');
        msg.channel.send(emb);
    }

    if (command === 'help') { //".help" command that have to be sent directly to the bot 
        if (msg.member.roles.has(config.adminRole)) {
            msg.author.send(baseHelp);
            const emb = new Discord.RichEmbed()
                .setTitle('Эксклюзивные команды админа')
                .setTitle('Доступны всем пользователям с ролью `Админ`')
                .addField('.update-rules', '**Обновить правила в соостветсвии с кодом**')
                .addField('.send-news', '**Отправить новость в новостной чат** *За помощью с синтаксииом этой комманды писать .helpnews.*')
                .setColor('#ffff00')
                .setFooter('Команды хоть и обрабатываются на наличие роли, но просьба держать их в секрете!');
            msg.author.send(emb);
            msg.delete();
        } else if (msg.member.roles.has(config.moderatorRole)) {
            msg.author.send(baseHelp);
            const emb = new Discord.RichEmbed()
                .setTitle('Эксклюзивные команды модератора')
                .setTitle('Доступны всем пользователям с ролью `Модератор`')
                .addField('.update-rules', '**Обновить правила в соостветсвии с кодом**')
                .addField('.send-news', '**Отправить новость в новостной чат** *За помощью с синтаксииом этой комманды писать .helpnews.*')
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
        }
    }
    if (command === 'helpnews') {
        if (msg.member.roles.has(config.adminRole) || msg.member.roles.has(config.moderatorRole) || msg.member.roles.has(config.curatorRole)) {
            let messsage = "";
            messsage += 'Итак, для отправки новостей используется следующий синтаксис:\n';
            messsage += 'Cпособ 1: отправка простого сообщения -- `.send-news simple <ваш_текст>`\n';
            messsage += 'Способ 2: отправка сложного сообщения -- `.send-news embed <цвет_сообщения>(можно не указывать) "<заголовок_поля>;<текст_поля>"`\n'
            messsage += 'Таких полей может быть не более 25. В каждом <тексте_поля> можно использовать Markdown, но его нельзя использовать в заголовках.\n';
            messsage += 'Примеры этих сообщений есть в новостном чате. Перед отправкой новостей просьба хорошенько подумать. Потому что их может удалять только модераторы и выше.\n';
            messsage += 'Сообщение отправлять мне лично!'
            msg.author.send(messsage);
        }
        msg.delete();
    }
    if (command === 'update-rules') { //sending embed with rules to rules channel
        if (msg.member.roles.has('548744682172186626') || msg.member.roles.has(config.moderatorRole)) {
            const emb = new Discord.RichEmbed()
                .setTitle('Правила нашего сервера')
                .setDescription('**Обязательно к прочтению**')
                .addField('Нарушение авторских прав', 'Бан на неделю')
                .addField('18+ запрещено!', '**За первое нарушение: Предупреждение и скрытия поста. За второй раз: Режим чтения и скрытия поста. За третий раз: Бан**')
                .addField('Реклама других сообществ,своего канала на ютубе запрещена', '**Удаление сообщения** *Можно попросить разрешения у модеров и выше*')
                .addField('Мат запрещен везде кромк NSFW каналов!', '**За злоупотребление: мут на 30 минут**')
                .addField('Оскорбления, угрозы, унижение достоинства личности запрещены!', '**Бан**')
                .addField('Спам запрещён!', '**Мут на 1 час**')
                .addField('Дискриминация', '**Бан на 8 дней**')                
                .addField('Слив переписки', '**Мут на день**')
                .addField('Поиск пар','**Мут на 4 дня**')
                .addField('Взлом аккаунта', '**Бан взломщика и взломанного**')
                .addField('Распространение личной информации без разрешения', '**Удаление сообщения + мут на день**')
                .addField('Обман администрации', '**Я не знаю как на это можно купиться, но бан гарантирован обманщику**')
                .setColor('#ff0000');

            let rulesChan = client.channels.get('575394554858045451');
            rulesChan.send(emb);
            msg.delete();
        }
    }
    if (command === 'mentioned') {
        let user = msg.mentions.users.first();
        msg.reply(user.tag)
    }
    if (command === 'report') {
        const service = client.channels.get('575395400282931201');
        let user = msg.mentions.users.first();
        args.shift();
        let reason = args.join(' ').trim();

        msg.channel.send(`Была подана жалоба на пользователя ${user.tag}. Приятного дня!)`)
        msg.delete();
        const emb = new Discord.RichEmbed()
            .setTitle('Жалоба на игрока')
            .setDescription('Не нравится чот')
            .addField('Кто?', `Пользователь ${user.tag}`)
            .addField('За что?', `Причина: ${reason}`)
            .setColor('#ff7b00')
            .setFooter('Просьба принять меры');
        service.send(emb);
    }

    if (command === 'send-news' && msg.channel.type === 'dm') {
        const news = client.channels.get('575733835875221504');
        if (args[0] === 'simple') {
            args.shift();
            let txt = args.join(' ').trim();
            txt += `\nАвтор: ${msg.author.tag}`;
            if (!txt) { msg.reply('Отсутствует текст новости!'); }
            news.send(txt);
            return 0;
        }
        if (args[0] === 'embed') {
            args.shift();
            let emb = new Discord.RichEmbed();
            let color = "";

            if (args[0].startsWith('#')) {
                color = args[0];
            } else if (!color.startsWith('"')) {
                color = colorAnalyser(args[0]);
                args.shift();
            } else {
                color = defaultcolor;
            }
            emb.setColor(color);
            sArgs = args.join(' ');
            let str = sArgs.slice(1, sArgs.length - 1);
            let params = str.split(';');
            emb.addField(params[0].trim(), params[1].trim());
            emb.setAuthor(msg.author.tag);
            news.send(emb);
            return 0;
        }
        msg.author.send('Ошибка в выборе вида новости :(')
    }

    if (command === 'rps') {
        rpsUser = msg.author;
        msg.channel.send('Играем до трех! Пиши камень, ножницы или бумага');
        playingRps = true;
    }

    if (playingRps === true && msg.author.id === rpsUser.id) {
        let bCh = Math.floor((Math.random() * 3) + 1);
        
        if (msg.content === 'камень') {
            //if (msg.content === )
        }
    }
    
});/*
client.on('guildMemberAdd', member => {
    member.createDM.send("Добро пожаловать на нащ сервер! Перед началом, напиши боту 'TF2 Bot' в личку и .help")
})
*/

client.on('error', (error) => {
    client.user.setActivity('PLAYING', { type: "в чёрный ящик :(" });
    console.log(error);
});
