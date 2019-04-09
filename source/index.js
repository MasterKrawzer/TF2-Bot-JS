const Discord = require('discord.js');

const Token = require("/Users/alexeytkachenko/Documents/GitHub/token.json");
const config = require("./config.json");

const client = new Discord.Client;

client.on("ready", () => {
    //console.log(`Bot started with ${client.users.size} users, in ${client.channels.size} channnels`);
    console.log("Connected as " + client.user.tag);
})
client.login(Token.token)
    .catch(console.error);

client.on("message", async msg => {
    if (msg.author.bot) return;

    var args = msg.content.split(" ");
    let command = args[0].slice(1);

    if (command === "test") {
        msg.channel.send(`Hello ${msg.author.tag}!`);
    }
    
    if (command == "ping") {
        const m = await msg.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms.`);
    }
    /*
    if (command === "say") {
        const sayMsg = args.join(" ");
        msg.delete().catch(O_o =>{});
        msg.channel.send(sayMsg);
    }

    if(command === "purge") {
        // This command removes all messages from all users in the channel, up to 100.
        
        // get the delete count, as an actual number.
        const deleteCount = parseInt(args[0], 10);
        
        // Ooooh nice, combined conditions. <3
        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
          return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
        
        // So we get our messages, and delete them. Simple enough, right?
        const fetched = await message.channel.fetchMessages({limit: deleteCount});
        message.channel.bulkDelete(fetched)
          .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }
    */
})  
