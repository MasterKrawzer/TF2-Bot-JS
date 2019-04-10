const Discord = require("discord.js");

const Token = require("/Users/alexeytkachenko/Documents/GitHub/token.json");
const config = require("./config.json");

const client = new Discord.Client;

users = client.users.array;

client.on("ready", () => {
    console.log(`Connected as ${client.user.tag}`);
    client.user.setActivity("за тобой ( ͡° ͜ʖ ͡°)", {type: "WATCHING"});
})
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

    if (msg.member.roles.has(config.adminId)) {

    }
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
        client.fetchUser(admin.id)
            .then(user => {user.send(`The user '${msg.author.tag}' wants to join chat '` + args[0] + "'. Allow him?")});
    }
    if (command === "delete") {
        if (msg.member.roles.has(config.adminRole) || msg.member.roles.has (config.moderatorRole) || msg.member.roles.has(config.curatorRole)) {
            msg.delete();
            if (args[0] > 100) {
                msg.channel.send("Can't delete more than 100 messages!");
                return;
            }

            msg.channel.bulkDelete(args[0])
                .catch(e => console.log(e));
            msg.channel.send("Deleted " + args[0] + " messages!")
                .then(msg => msg.delete(1000));
        }
    }
    /*if (command === "mge-join") {
        msg.member.addRole("560716350784536596");
        msg.guild.createChannel('mge-private', 'voice', [{
            id : msg.guild.id,
            deny: ['CONNECT']
        }]);
        const chann = client.channels.find((ch => ch.name === 'mge-private'));length
    }*/
})  
