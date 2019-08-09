"use strict"

const Discord = require("discord.js")
const Token = require("/Users/alexeytkachenko/Documents/GitHub/discordtoken.json")
const config = require("./config.json")
const fs = require('fs')
const Enmap = require('enmap')

const test = require("./modules/test")
const memes = require('./modules/memes')
const amino = require('./modules/amino')
const help = require('./modules/help')
const helpnews = require('./modules/helpnews')
const updaterules = require('./modules/update-rules')
const report = require('./modules/report')
const send_news = require('./modules/send-news')
const rps = require('./minigames/rps')
const comp = require('./modules/group')
const remove = require('./modules/remove')
const del = require('./modules/delete')
const init_users = require('./modules/init-users')
const rep = require('./modules/rep')
const emojis = require('./emojis')

const client = new Discord.Client({
    autoReconnect: true,
    messageCacheLifetime: 0
})

var createdChannels = new Map()

client.on("ready", () => {
    console.log(`Connected as ${client.user.tag}`)
    client.user.setActivity("за тобой ( ͡° ͜ʖ ͡°)", { type: "WATCHING" })
})

client.login(Token.token)
    .catch(console.error)

client.on("message", async msg => {
    if (msg.author.bot) {
        if (!msg.content.startsWith("+") || !msg.content.startsWith(config.prefix)) return 2
    }
    
    var args = msg.content.split(" ") //create args array
    let command = args[0].slice(1) //get the clear command for the args and clear it of the prefix
    args.shift() //delete args's first element (the command)
    // var users = client.users.array
    var sArgs = args.join(" ") //join what's left of the args into one string

    if (command === "test") {//Test command that sends "Hello + user's tag"
        test(msg)
    }

    if (command == 'send-args') {
        msg.channel.send(args)
        console.log(args)
    }

    if (command == "ping") { //Ping command that calculates bot's ping
        msg.reply(`пинг бота: ${client.ping}`)
    }

    if (command === "memes") { //send embed message with links to TF2 meme reddit/VK communities
        memes(msg)
    }
    if (command === "amino") { //same thing like above but about our russian TF2 amino community
        amino(msg)
    }
    if (command === 'help') { //".help" command that have to be sent directly to the bot 
        help(msg)
    }
    if (command === 'help-news') {
        helpnews(msg)
    }
    if (command === 'update-rules') {
        updaterules(msg, client)
    }
    if (command === 'mentioned') {
        console.log(msg.mentions.users.first())
        return 0
    }
    if (command === 'report') {
        report(msg, client, args)
    }

    if (command === 'send-news') { //.send-news command
        send_news(msg, client, args)
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
            .setColor('#ff00e5')
        msg.author.send(emb)
        return 0
    }
    if (command === 'rps') {
        rps(msg, args)
    }
    if (command === 'group') {
        comp(msg, args, createdChannels)
    }
    if (command === 'remove') {
        remove(msg, createdChannels)
    }
    if (command === 'delete') {
        del(msg, args)
    }
    if (command === 'text') {
        var allText
        fetch.fetchUrl(msg.attachments.array()[0].url, function (error, meta, body) {
            console.log(body.toString())
        })
    }

    if (command === 'init-users') {
        init_users(msg)
    }
    if (msg.content.startsWith('+rep')) {
        rep(msg, args)
    }

    if (command === 'get-emoji') {
        console.log(client.emojis.find(e => e.name = ':one:'))
    }

    if (command === 'vote') {
        var emb = new Discord.RichEmbed().setColor('#ffa500')
        if (args[0]) {
            var options = args.join(' ').split(';')
            emb.setTitle(options[0])
            options.shift()
            if (options.length > 10) {
                msg.reply('нельзя указывать более 10 опций!')
            }

            var stringOptions = new String()
            options.forEach((o, i) => {
                stringOptions += (i + 1).toString() + ". " + o.trim() + "\n"
            })
            emb.setDescription('**' + stringOptions.slice(0, stringOptions.length - 1) + "**")
            msg.channel.send(emb)
                .then(async msgg => {
                    for (var i = 1; i < options.length + 1; i++) {
                        await msgg.react(emojis[i])
                    }
                })
        } else {
            msg.reply('укажите опции голосования!')
        }

    }
    if (command === 'ban') {
        var victimn = msg.mentions.members.first()
        var avatarURL = ''
        if (victimn.user.avatar) {
            var pendingAvatar = victimn.user.avatarURL.split('size=')
            pendingAvatar[1] = '128'
            avatarURL = pendingAvatar.join('size=')
        } else {
            avatarURL = victimn.user.defaultAvatarURL + "?size=128"
        }

        var reason = args[1]
        msg.reply(`Вы, ${msg.author.username}, уверены в том, что хотите забанить ${victimn.user.username} по причине '${reason}'?`)
            .then(async m => {
                await m.react('✅')
                m.react('❌')
                m.awaitReactions((reaction, user) => reaction.emoji.name == "✅" && user.id == msg.author.id, { time: 15000 })
                    .then(reactions => {
                        if (reactions.size > 0) {
                            const ban = new Discord.RichEmbed()
                                .setTitle(`Забанен игрок ${victimn.user.username}!`)
                                .addField('Забанен игроком', msg.author.username, true)
                                .addField('Причина', reason, true)
                                .setImage(avatarURL)
                                .setColor('#FF0000')
                                .setFooter('Мы тебя забудем', client.user.avatarURL)
                                .setTimestamp(new Date())
                            msg.channel.send(ban)
                            victimn.ban({days: 7, reason: reason})
                        }
                    })
            })
    }
})
client.on('disconnect', () => {
    // let с = client.channels.find(c => c.id == '598558300954427408')
    // с.send('@everyone, я вырубаюсь.')
    // client.user.setActivity('PLAYING', { type: "в чёрный ящик :(" })
    let date = new Date()
    console.log(date)
})
client.on('error', (error) => {
    // let с = client.channels.find(c => c.id == '598558300954427408')
    // с.send('@everyone, у меня ошибка, я вырубаюсь.')
    // client.user.setActivity('PLAYING', { type: "в чёрный ящик :(" })
    console.log(error)
    let date = new Date()
    console.log(date)
})
