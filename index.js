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
const comp = require('./modules/comp')

const client = new Discord.Client
const defaultcolor = '#4F545C'
var createdChannels = new Map()
var users = new Map()
class user {
    constructor(id) {
        this.id = id
        this.rep = 0
    }
    info() {
        const emb = new Discord.RichEmbed()
            .setTitle(`Рассматриваем игрока ${client.users.find(u => u.id == id).username}`)
            .addField(`Репутация: ${this.rep}`)
            .setAuthor(msg.author)
        msg.channel.send(emb)
    }
}

function set_database(map) {
    fs.writeFile('database.json', JSON.stringify([...map]), error => { if (error) { console.log(error) } })
}

function get_database() {
    var result = new Map()
    fs.readFile('database.json', (error, data) => {
        console.log(JSON.parse(data.toString()))
        result = JSON.parse(data.toString())
    })
    return result
}

function rightViolation(msg) {
    let m1 = msg
    msg.reply('у Вас нет прав на эту команду!')
        .then(m => {
            m1.delete()
            m.delete(1500)
        })
}

client.on("ready", () => {
    console.log(`Connected as ${client.user.tag}`)
    client.user.setActivity("за тобой ( ͡° ͜ʖ ͡°)", { type: "WATCHING" })
})

client.login(Token.token)
    .catch(console.error)

client.on("message", async msg => {

    if (msg.author.bot || !msg.content.startsWith(config.prefix)) return 2

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
    }

    if (command == "ping") { //Ping command that calculates bot's ping
        const m = await msg.channel.send("Ping?")
            .catch(e => console.log(e))
        m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. Bot's Latency is ${Math.round(client.ping)}ms.`)
            .catch(e => console.log(e))
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
    if (command === 'helpnews') {
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
    if (command === 'comp') {
        comp(msg, args, createdChannels)
    }
    if (command === 'remove') {
        if (createdChannels.get(msg.author)) {
            let category = msg.guild.channels.find(c => c.name == createdChannels.get(msg.author))
            let channeldsToDelete = category.children.map(c => { return c })
            console.log(channeldsToDelete.map(c => { return c.name }))

            channeldsToDelete[0].delete().catch(console.error)
            channeldsToDelete[1].delete().catch(console.error)
            category.delete()

            msg.reply(`удалена группа **'${category.name}'**!`)
            createdChannels.delete(msg.author)
        } else {
            msg.reply('у Вас нет созданных групп!')
            return 1
        }
    }
    if (command === 'delete') {
        if ((msg.member.roles.has(config.adminRole)) || (msg.member.roles.has(config.moderatorRole))) {
            console.log(parseInt(args[0]) + 1)
            if (args[0] > 99) {
                msg.reply('нельзя удалять более 99 + 1 сообщений за раз!')
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
            console.log(body.toString())
        })
    }

    if (command === 'init-users') {
        var users = new Map()
        client.users.forEach(u => {
            users.set(u.id, 0)
        })
        set_database(users)
        var users = get_database()
        console.log([...users])
    }
    if (command === '+rep') {
        var senderId = msg.author
        var getterId = msg.mentions.users.first().id
        users = get_database()
        if (users.get(getterId) < args[1]) {
            msg.reply('У Вас слишком мало репутации для отправки! ' + users.get(getterId))
        }
        users.set(getterId, args[1])
        set_database(users)
        users = get_database()
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
