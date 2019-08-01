const config = require("../config.json")

module.exports = (msg, args) => {
    if ((msg.member.roles.has(config.adminRole)) || (msg.member.roles.has(config.moderatorRole))) {
        if (!args[0]) {
            msg.reply('укажите количество сообщений для удаления!')
        }
        if (args[0] > 99) {
            msg.reply('нельзя удалять более 99 + 1 сообщений за раз!')
            return 1
        }
        msg.channel.bulkDelete(parseInt(args[0]) + 1, true)
            .then(m => {
                msg.reply(`удалено ${m.size} сообщений!`)
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