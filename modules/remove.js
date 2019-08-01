module.exports = (msg, createdChannels) => {
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