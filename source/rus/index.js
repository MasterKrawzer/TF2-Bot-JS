"use strict";
const Discord = require("discord.js");
const Token = require("/Users/alexeytkachenko/Documents/GitHub/discordtoken.json");
const config = require("./config.json");
const fs = require('fs');


const client = new Discord.Client;
client.on("ready", () => {
    console.log(`Connected as ${client.user.tag}`);
    client.user.setActivity("за тобой ( ͡° ͜ʖ ͡°)", {type: "WATCHING"});
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

    //Admin's role id: 548744682172186626
    //Moderator's role id: 548744536512528391
    if (command === "test") {
        msg.channel.send(`Hello ${msg.author.tag}!`);
    }

    if (msg.channel.type === "dm" && command === "dm-hi") {
        msg.author.send("Hi!");
    }

    if (command == "ping") {
        const m = await msg.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. Bot's Latency is ${Math.round(client.ping)}ms.`);
    }
    if (command === "print-args") {
            msg.channel.send(args);
    }
    if (command === "say") {
        msg.delete();
        msg.channel.send(args.join(" "));
    }
    if (command === "join-chat") {
        const data = fs.readFileSync('./requestID.txt');

        let requestID = parseInt(data, 10);

        const emb = new Discord.RichEmbed()
            .setTitle('Новый запрос')
            .setDescription('Запрос на добавление в чат')
            .addField('Кто?', `**Пользователь ${msg.author.tag}**`)
            .addField('Какой чат?', `**Чат: ${args[0]}**`)
            .setFooter('ID запроса: ' + requestID)
            .setColor('#fffb3a');

        let chan = client.channels.get('567959560900313108');
        chan.send(emb);

        requestID++;
        
        fs.writeFileSync('./requestID.txt', requestID.toString(10));
    }
    if (command === "report") {
        const data = fs.readFileSync('./requestID.txt');

        let requestID = parseInt(data, 10);

        const emb = new Discord.RichEmbed()
            .setTitle('Новый запрос')
            .setDescription('**Жалоба на пользователя**')
            .addField('Кто?', `**Пользователь ${msg.author.tag}**`)
            .addField('На кого?', `**На пользователя ${msg.mentions.users.first().tag}**`)
            .addField('Причина', `**${sArgs}**`)
            .setFooter('ID запроса: ' + requestID)
            .setColor('#ff0000');
        let chan = client.channels.get('567959560900313108');
        chan.send(emb);

        requestID++;
        
        fs.writeFileSync('./requestID.txt', requestID.toString(10));
    }
    if (command === "mentioned") {
        console.log(msg.mentions.users.first().tag);
    }
    if (command === 'delete') {
        msg.channel.fetchMessages({ 
            limit: args[0] // Fetch last 50 messages.
        }).then((msgCollection) => { // Resolve promise
            msgCollection.forEach((msg) => { // forEach on message collection
                msg.delete(); // Delete each message
            })
        });
    }
    if (command === "send-service") {
        let chan = client.channels.find('id', '571951106985295873');
        chan.send('Send nudes');
    }
    if (command === "memes") {
        const emb = new Discord.RichEmbed()
        .setTitle("Группы с мемами про TF2")
        .setDescription("Группы с мемами про TF2 с разных соцсетей")
        .addField('TF2 Subreddit','https://www.reddit.com/r/tf2/')        
        .addField('TF2 sh*t poster club subreddit', 'https://www.reddit.com/r/tf2shitposterclub/')
        .addField('TF2 VK мемы','https://vk.com/tf2_muvikigmod')
        .addField('Мемы про Valve','https://vk.com/valvememes')
        .setColor('#f48f42');
        msg.channel.send(emb);
    }
    if (command === "amino") {
        msg.delete();
        const emb = new Discord.RichEmbed()
        .setTitle('Наша группа Amino')
        .setDescription('[**__Основная инфа тут__**](https://aminoapps.com/c/SafeTF2/home/)')
        //.addField('https://aminoapps.com/c/TF2AminoRUS/home/', '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
        .setThumbnail('http://chittagongit.com/images/teamfortress-2-icon/teamfortress-2-icon-25.jpg')
        .setFooter('Присоединяйся!', 'http://chittagongit.com/images/teamfortress-2-icon/teamfortress-2-icon-25.jpg')
        .setColor('#24ad18');
        msg.channel.send(emb);
    }

    if (msg.channel.type == 'dm' && command === 'help') {
        const emb = new Discord.RichEmbed()
        .setTitle('Комманды бота')
        .setDescription('Все комманды начинаются с точки (.)!')
        .addField('.memes', 'Показывает все паблики с мемами')
        .addField('.amino', 'Показывает ссылку на наш Амино :)')
        .addField('.join-chat', 'Попросить присоединиться в закрытый чат')
        .addField('.report', 'Отправить жалобу на игрока')
        .setThumbnail('https://cdn.icon-icons.com/icons2/1155/PNG/512/1486564730-gears-cogs_81537.png')
        .setFooter('Не забудь про точку!')
        .setColor('#ff0000');
        msg.author.send(emb);
    }
    if (command === 'update-rules') {
        if (msg.member.roles.has(config.adminRole) || msg.member.roles.has (config.moderatorRole) || msg.member.roles.has(config.curatorRole)) {
            
            const emb = new Discord.RichEmbed()
                .setTitle('Правила нашего сервера')
                .setDescription('**Обязательно к прочтению**')
                .addField('18+ запрещено!', '**За первое нарушение: Предупреждение и скрытия поста. За второй раз: Режим чтения и скрытия поста. За третий раз: Бан**')
                .addField('Реклама других сообществ,своего канала на ютубе запрещена!', '**Удаление сообщения и полный мут на 7 дней**')
                .addField('Мат запрещен везде кромк NSFW каналов!', '**За злоупотребление: мут на 30 минут**')
                .addField('Оскорбления, угрозы, унижение достоинства личности запрещены!', '**Бан**')
                .addField('Спам запрещён!', '**Мут на 1 час**')
                .setColor('#ff0000');

            let rulesChan = client.channels.get('571957023495815168');
            rulesChan.send(emb);
            msg.delete();
        }
    } 
    if (command === 'update-news' && msg.channel.type === 'dm') {
        if (args[0] === 'simple') { 
            newsChan.send(args.join(' '));
        }
        if (args[0] === 'embed') {
            args = sArgs.split(';');
            const emb = new Discord.RichEmbed()
            .setTitle(args[0])
            .setDescription(args[1])
            .setColor(args[3])
            //.setAuthor(msg.author.tag);
            newsChan.send(emb);
        }
        if (args[0] === 'embed1') {
            args = sArgs.split(';');
            const emb = new Discord.RichEmbed()
            .setTitle(args[0])
            .setDescription(args[1])
            .setColor(args[2])
            .addField(args[3], args[4])
            newsChan.send(emb);
        }
        if (args[0] === 'embed2') {
            args = sArgs.split(';');
            const emb = new Discord.RichEmbed()
            .setTitle(args[1])
            .setDescription(args[2])
            .setColor(args[3])
            .addField(args[4], args[5])
            .addField(args[6], args[7])
            newsChan.send(emb);
        }
    }

    if (command === 'resolveRequest') {
        if (msg.member.roles.has(config.adminRole) || msg.member.roles.has (config.moderatorRole) || msg.member.roles.has(config.curatorRole)) {
        msg.channel.fetchMessages({limit: 50})
            .then(messages => {
                console.log(messages);
            });
        }
    }
    if (command === 'ban') {
        if (msg.member.roles.has(config.adminRole) || msg.member.roles.has (config.moderatorRole)) {
            const emb = new Discord.RichEmbed()
            .setTitle('Бан игрока')
            .setDescription('Доигрался')
            .addField('Кто?', `Пользователь ${msg.author.tag}`)
            .addField('Кого?', `Пользователя ${msg.mentions.users.first().tag}`)
            .addField('За что?', sArgs.slice(msg.mentions.users.first().tag.toString().length + 1))
            .setColor('#ff0000');
            msg.channel.send(emb);
            args.shift()
            msg.mentions.members.first().ban(args.join(' '));
        }
    }
    if (command === 'args' && msg.channel.type === 'dm') {
        msg.author.send(args);
        args.shift();
        args = sArgs.split(';');
        msg.author.send(args);
    }
});
/*
client.on('guildMemberAdd', member => {
    member.createDM.send("Добро пожаловать на нащ сервер! Перед началом, напиши боту 'TF2 Bot' в личку и .help")
})
*/
client.on('error', (error) => {
    client.user.setActivity('PLAYING', {type : "в чёрный ящик :("});
    console.log(error);
});
