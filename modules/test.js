module.exports = (msg) => {
    msg.channel.send(`Hello ${msg.author.tag}!`)
        .catch(console.error)
    return 0;
}