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
const remove = require('./modules/remove')
const del = require('./modules/delete')
const client = new Discord.Client

var createdChannels = new Map()
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

client.on("ready", () => {
    console.log(`Connected as ${client.user.tag}`)
    client.user.setActivity("за тобой ( ͡° ͜ʖ ͡°)", { type: "WATCHING" })
})

client.login(Token.token)
    .catch(console.error)

client.on("message", async msg => {

    if (msg.author.bot || !msg.content.startsWith(config.prefix)) {
        if (!msg.content.startsWith("+")) return 2
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
    if (command === 'comp') {
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
        if (msg.author.id == "315339158912761856") {
            var db = new Object();
            msg.guild.members.forEach(m => {
                if (m.roles.has("548744682172186626")) { //If user's an admin
                    db[m.id] = {
                        "rep": 1000,
                        "mge": 0
                    }
                } else if (m.roles.has("548744536512528391")) { //If user's a moderator
                    db[m.id] = {
                        "rep": 500,
                        "mge": 0
                    }
                } else { //If user's is a mortal
                    db[m.id] = {
                        "rep": 0,
                        "mge": 0
                    }
                }
            })
            fs.writeFile('database.json', JSON.stringify(db, null, 2), () => { return }) //Save that bs
            console.log("Succesfully initilized and reset user's stats")
        }
    }
    if (msg.content.startsWith('+rep')) {
        var db = JSON.parse(fs.readFileSync('database.json')) //Get the database 
        var getter = msg.author
        var sender = msg.mentions.users.first()
        
        if (sender == undefined) { //Check if user isn't defined
            msg.reply('не указан пользователь!')
            return 1
        }

        if (db[getter.id]["rep"] < args[1]) { //Checking if user got enough reputation
            msg.reply(`Невозможно отправить столько репутации! ${args[1]} rep > ${db[getter.id]["rep"]} rep`)
            return 1
        }
        db[sender.id]["rep"] = parseInt(db[sender.id]["rep"]) + parseInt(args[1]) //Transmitting reputation
        db[getter.id]["rep"] = parseInt(db[getter.id]["rep"]) - parseInt(args[1])
        fs.writeFile('database.json', JSON.stringify(db, null, 2), (error) => { //Saving the database
            if (error) {
                console.log(error)
            } else {
                msg.reply("Успешно передана репутация пользователю " + sender.username)
            }
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
