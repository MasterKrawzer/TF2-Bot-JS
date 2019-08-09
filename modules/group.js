module.exports = (msg, args, createdChannels) => {
    if (createdChannels.get(msg.author)) {
        msg.reply(`у Вас уже есть группа **#${createdChannels.get(msg.author)}**!`)
    }

    if (!args[0]) { //If name is defined
        msg.reply('укажите название группы!')
        return 0
    }
    var values = args.join(' ').split(',')
    let name = values[0].trim()

    if (name.match('<@!')) { //If name contains user id
        msg.reply('в названии группы Вы указали игрока!');
        return 1;
    }
    args.shift();

    if (!values[0]) { //If players are defined
        msg.reply('укажите игроков для игры!')
        return 1
    }
    values.shift()

    values.forEach(u => {
        if (msg.guild.roles.find(r => r.id == u)) {

        }
        if (!u.match('<@')) { //If player defined is not a user
            msg.reply(`указан неверный игрок __*${u}*__!`);
            return 1
        }
    });

    msg.guild.createChannel(name, { //Create the category channel
        type: 'category',
        permissionOverwrites: [ //Overwrite permissions so noone can access the 'group'
            {
                id: msg.guild.defaultRole.id,
                deny: 'VIEW_CHANNEL'
            }
        ]
    })
        .then(c => {
            c.overwritePermissions(msg.author, { //Overwrite permissions for the user so he can accs and write in the channel
                'VIEW_CHANNEL': true,
                'SEND_MESSAGES': true
            }).catch(console.error)
            msg.mentions.users.forEach(p => { //So do for the mentioned players 
                c.overwritePermissions(p, {
                    'VIEW_CHANNEL': true,
                    'SEND_MESSAGES': true
                }).catch(console.error)
            });

            msg.guild.createChannel('text', { //Add text channel
                type: 'text',
                parent: c
            })

            msg.guild.createChannel('voice', { //Add voice channel
                type: 'voice',
                userLimit: args.length + 1,
                parent: c
            })
            msg.reply(`был создан канал \'${name}\'. Не забудьте потом его удалить командой *!remove*!`)
            createdChannels.set(msg.author, name) //Add user to the map so he can't spam channels
        })
}