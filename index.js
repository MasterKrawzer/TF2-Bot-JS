"use strict";

const Discord = require("discord.js");
const Token = require("/Users/alexeytkachenko/Documents/GitHub/discordtoken.json");
const config = require("./config.json");

const test = require("./modules/test");
const memes = require('./modules/memes')
const amino = require('./modules/amino')
const help = require('./modules/help')
const helpnews = require('./modules/helpnews')
const updaterules = require('./modules/update-rules')
const report = require('./modules/report')

const client = new Discord.Client;
const defaultcolor = '#4F545C';
var createdChannels = new Map()



function rightViolation(msg) {
    let m1 = msg
    msg.reply('у Вас нет прав на эту команду!')
        .then(m => {
            m1.delete()
            m.delete(1500)
        })
}

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
        case 'orange':
            return '#ffa500'
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
    if (msg.author.bot || !msg.content.startsWith(config.prefix)) return 2;

    var args = msg.content.split(" "); //create args array
    let command = args[0].slice(1); //get the clear command for the args and clear it of the prefix
    args.shift(); //delete args's first element (the command)
    // var users = client.users.array;
    var sArgs = args.join(" "); //join what's left of the args into one string

    if (command === "test") {//Test command that sends "Hello + user's tag"
        test(msg);
    }

    if (command == 'send-args') {
        msg.channel.send(args)
    }

    if (command == "ping") { //Ping command that calculates bot's ping
        const m = await msg.channel.send("Ping?")
            .catch(e => console.log(e));
        m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. Bot's Latency is ${Math.round(client.ping)}ms.`)
            .catch(e => console.log(e));
    }

    if (command === "memes") { //send embed message with links to TF2 meme reddit/VK communities
        memes(msg);
    }
    if (command === "amino") { //same thing like above but about our russian TF2 amino community
        amino(msg);
    }
    if (command === 'help') { //".help" command that have to be sent directly to the bot 
        help(msg);
    }
    if (command === 'helpnews') {
        helpnews(msg);
    }
    if (command === 'update-rules') {
        updaterules(msg)
    }
    if (command === 'mentioned') {
        console.log(msg.mentions.users.first())
        return 0;
    }
    if (command === 'report') {
        report(msg, client, args)    
    }

    if (command === 'send-news') { //.send-news command
        if (msg.member.roles.has(config.adminRole) || msg.member.roles.has(config.moderatorRole) || msg.member.roles.has(config.curatorRole)) {
            const news = client.channels.get('598558300954427408'); //getting the news channel
            if (args[0] === 'simple') { //if user wants just to send simple message as a news
                args.shift(); //removing 'simple'
                if (args[0] === 'dm') { //if user wants to send news to everyone on the server 
                    if (msg.member.roles.has(config.adminRole)) { //and if the member has admin role
                        args.shift(); //removing 'dm'
                        let txt = args.join(' ').trim(); //getting and trimming the text
                        if (!txt) { msg.reply('Отсутствует текст новости!'); return 1; }  //if no text specified reply with an error
                        txt += `\nАвтор: ${msg.author.tag}` //addding the author to the message
                        client.users.forEach((u, i, users) => { //for each user on the server
                            if (!u.bot) { //if user isn't a bot
                                u.send(txt) //send message with txt
                                    .catch(e => { //resolving promise if something goes wrong so our bot won't crash
                                        console.error()
                                        console.log(u)
                                    });
                            }
                        })
                        //.catch(e => console.log(e)); //resolving promise when getting users if something goes wrong so our bot won't crash
                        msg.author.send('Успешно отпралена рассылка пользователям!')
                        return 0;
                    } else { //if non-admin user decided to do the mailing
                        msg.reply('Не достаточно прав для рассылки!') //just repling that he/she doesn't have enough permissions
                        return 1;
                    }
                } else { //if 'dm' isn't specified
                    let txt = args.join(' ').trim(); //same thing as described before
                    if (!txt) { msg.reply('Отсутствует текст новости!'); return 1; }
                    txt += `\nАвтор: ${msg.author.tag}`
                    news.send(txt);
                    msg.delete()
                    msg.channel.send(`<@${msg.author.id}>, успешно опубликованна новость!`)
                        .then(m => {
                            m.delete(500);
                        });
                    return 0;
                }
            }
            if (args[0] === 'embed') { //if user w
                args.shift();
                let emb = new Discord.RichEmbed();
                let color = "";
                if (args[0].startsWith('"')) {
                    color = defaultcolor
                } else if (args[0].startsWith('#')) {
                    color = args[0].toLowerCase()
                    console.log(color)
                    args.shift();
                } else {
                    color = colorAnalyser(args[0])
                    args.shift();
                }
                emb.setColor(color);
                if (!args[0]) {
                    msg.reply('Не указаны поля новости!');
                    return 1;
                }
                if (args.length > 25) {
                    msg.reply('Слишком много полей!');
                    return 1;
                }
                sArgs = args.join(' ');
                let newArgs = sArgs.split('" "');
                let i = 0
                newArgs.forEach((str, i) => {
                    newArgs[i] = str.slice(1, str.length - 1)
                })

                newArgs.forEach((val, i, newArgs) => {
                    let params = val.split(';');
                    if (!params[0] || !params[1]) {
                        msg.reply('Не указаны значения поля!')
                        return 1;
                    }
                    emb.addField(params[0].trim(), params[1].trim());
                })

                emb.setAuthor(msg.author.tag);
                news.send(emb)
                let m1 = msg
                msg.reply('успешно опубликованна новая новость!')
                    .then(async m => {
                        m1.delete()
                        m.delete(1500)
                    })
                return 0;
            }
            let m1 = msg
            msg.reply('Ошибка в выборе вида новости :(')
                .then(m => {
                    m.delete(2000)
                    m1.delete(5000)
                })
            return 1;
        } else {
            rightViolation(msg)
        }
    }
    if (command === 'colors' && msg.channel.type === 'dm') {
        let emb = new Discord.RichEmbed()
            .setTitle('Список готовых цветов')
            .setDescription('Их можно указывать в качестве цвета новости')
            .addField('red', 'Красный')
            .addField('green', 'Зелёный')
            .addField('blue', 'Синий')
            .addField('lightblue', 'Голубой')
            .addField('black', 'Чёрный')
            .addField('white', 'Белый')
            .addField('orange', 'Оранжевый')
            .addField('pink', 'Розовый')
            .setColor('#ff00e5');
        msg.author.send(emb);
        return 0;
    }
    if (command === 'rps') {
        if (args[0]) {
            let choice = Math.floor(Math.random() * (3 + 1 - 1)) + 1
            console.log(choice)
            if (choice == 1) {
                switch (args[0].toLocaleLowerCase().trim()) {
                    case "rock":
                        msg.reply("Камень. Ничья.")
                        break
                    case "paper":
                        msg.reply("Камень. Ладно, ты выиграл...")
                    case "scissors":
                        msg.reply("Камень. Я выиграл!")
                        break
                    default:
                        break
                }
            }

            if (choice == 2) {
                switch (args[0].toLocaleLowerCase().trim()) {
                    case "rock":
                        msg.reply("Ножницы. Ты выиграл.")
                        break
                    case "paper":
                        msg.reply("Ножницы. Хаха!")
                    case "scissors":
                        msg.reply("Ножницы. Ничья.")
                        break
                    default:
                        break
                }
            }

            if (choice == 3) {
                switch (args[0].toLocaleLowerCase().trim()) {
                    case "rock":
                        msg.reply("Бумага. Ладно...")
                        break
                    case "paper":
                        msg.reply("Бумага. Ничья")
                    case "scissors":
                        msg.reply("Бумага. Моя взяла!")
                        break
                    default:
                        break
                }
            }

        } else {
            msg.reply("Ммм, ты собираешься выбирать?")
        }
        return 0;
    }
    if (command == "comp") {
        if (!createdChannels.get(msg.author)) {
            if (args) {
                let name = args[0].trim()
                // if (name.search(/><\@/gi) != -1) {
                //     msg.reply('в названии группы Вы указали игрока!');
                //     return 1;
                // }
                if (name.includes('<') || name.includes('>') || name.includes('@')) {
                    msg.reply('в названии группы Вы указали игрока!');
                    return 1;
                }
                args.shift();
                var wrongPlayer = false //Here bot checks if there's a non-user string in 'mentioned users' sections
                console.log(args)
                args.forEach(u => {
                    if (!u.startsWith('<@') || !u.endsWith('>')) {
                        msg.reply('указан неверный игрок!');
                        wrongPlayer = true;
                    }
                });
                if (wrongPlayer) { return 1; }

                if (args[0]) { //If user defined players
                    msg.guild.createChannel(name, { //Create the category channel
                        type: 'category',
                        permissionOverwrites: [ //Overwrite permissions so noone can access the 'group'
                            {
                                id: msg.guild.defaultRole.id,
                                deny: 'VIEW_CHANNEL'
                            }
                        ]
                    })
                        .then(c => {
                            c.overwritePermissions(msg.author, { //Overwrite permissions for the user so he can assecc and write in the channel
                                'VIEW_CHANNEL': true,
                                'SEND_MESSAGES': true
                            }).catch(console.error)
                            msg.mentions.users.forEach(p => { //So do for the mentioned players 
                                c.overwritePermissions(p, {
                                    'VIEW_CHANNEL': true,
                                    'SEND_MESSAGES': true
                                }).catch(console.error)
                            });

                            msg.guild.createChannel('text', { //Add text channel
                                type: 'text',
                                parent: c
                            })

                            msg.guild.createChannel('voice', { //Add voice channel
                                type: 'voice',
                                userLimit: args.length + 1,
                                parent: c
                            })
                            msg.reply(`был создан канал \'${name}\'. Не забудьте потом его удалить командой *.remove*!`)
                            createdChannels.set(msg.author, name) //Add user to the map so he can't spam channels
                        })
                } else {
                    msg.reply("укажите хотя бы одного игрока для группы!")
                }
            } else {
                msg.reply("укажите игроков для игры и название группы!")
            }
        } else {
            msg.reply(`у Вас уже есть группа **#${createdChannels.get(msg.author)}**!`)
        }
    }
    if (command === 'remove') {
        if (createdChannels.get(msg.author)) {
            let category = msg.guild.channels.find(c => c.name == createdChannels.get(msg.author));
            let channeldsToDelete = category.children.map(c => { return c });
            console.log(channeldsToDelete.map(c => { return c.name }));

            channeldsToDelete[0].delete().catch(console.error);
            channeldsToDelete[1].delete().catch(console.error);
            category.delete()

            msg.reply(`удалена группа **'${category.name}'**!`);
            createdChannels.delete(msg.author);
        } else {
            msg.reply('у Вас нет созданных групп!');
            return 1;
        }
    }
    if (command === 'delete') {
        if ((msg.member.roles.has(config.adminRole)) || (msg.member.roles.has(config.moderatorRole))) {
            console.log(parseInt(args[0]) + 1)
            if (args[0] > 100) {
                msg.reply('нельзя удалять более 100 сообщений за раз!')
                return 1
            }
            msg.channel.bulkDelete(parseInt(args[0]) + 1, true)
                .then(m => {
                    msg.reply(`удалено ${m.size} + 1 сообщений!`)
                        .then(m => m.delete(1000))
                })
                .catch(() => {
                    console.error()
                    return 1
                })
        } else {
            msg.reply('у Вас нет прав на эту команду!')
            return 1
        }
    }
    if (command === 'text') {
        var allText
        fetch.fetchUrl(msg.attachments.array()[0].url, function (error, meta, body) {
            console.log(body.toString());
        });
    }
});
client.on('error', (error) => {
    client.user.setActivity('PLAYING', { type: "в чёрный ящик :(" });
    console.log(error);
});
