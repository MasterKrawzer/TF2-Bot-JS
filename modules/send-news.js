const config = require("../config.json");
const Discord = require("discord.js");
const defaultcolor = '#4F545C'
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
module.exports = (msg, client, args) => {
    if (msg.member.roles.has(config.adminRole) || msg.member.roles.has(config.moderatorRole) || msg.member.roles.has(config.curatorRole)) {
        const news = client.channels.get('598558300954427408'); //getting the news channel
        if (args[0] === 'simple') { //if user wants just to send simple message as a news
            args.shift(); //removing 'simple'
            //if 'dm' isn't specified
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

        if (args[0] === 'embed') { //In case of embeded message
            args.shift(); //Shift 'embed'
            let emb = new Discord.RichEmbed();
            let color = "";
            
            if (args[0].startsWith('"')) {  //Get the color of the message
                color = defaultcolor
            } else if (args[0].startsWith("#")) {
                color = args[0]
            } else {
                color = colorAnalyser(args[0])
            }
            args.shift() //Shift color
            emb.setColor(color);

            if (!args[0]) {
                msg.reply('Не указаны поля новости!');
                return 1;
            }
            let fields = args.join(' ').split('"')
            fields.forEach((f, i) => { //Filter 'fields' from empty elements
                if (f == "" || f == " ") {
                    fields.splice(i, 1)
                }
            });

            if (fields.length > 25) {
                msg.reply('Слишком много полей!');
                return 1;
            }
            var text = new Array()
            fields.forEach(f => { //Splitting elemets of the 'fields' into arrays of field parts
                text.push(f.split(';'))
            })
            
            text.forEach(val => { //Adding fields to the message
                let params = val;
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
        msg.reply('Ошибка в выборе вида новости :(')
            .then(m => {
                m.delete(2000)
            })
        return 1;
    } else {
        rightViolation(msg)
    }
}