const config = require("./config.json");
const Discord = require("discord.js");
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