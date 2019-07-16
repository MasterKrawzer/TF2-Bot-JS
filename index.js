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
const send_news = require('./modules/send-news')
const rps = require('./minigames/rps')

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
        report(msg, client, args);
    }

    if (command === 'send-news') { //.send-news command
        send_news(msg, client, args);
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
        rps(msg, args);
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
