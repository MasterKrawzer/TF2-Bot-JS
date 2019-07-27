module.exports = (msg,args, createdChannels) => {
    if (!createdChannels.get(msg.author)) {
        if (args) {
            let name = args[0].trim()
            // if (name.search(/><\@/gi) != -1) {
            //     msg.reply('в названии группы Вы указали игрока!');
            //     return 1;
            // }
            if (name.includes('<') || name.includes('>') || name.includes('@')) {
                msg.reply('в названии группы Вы указали игрока!');
                return 1;
            }
            args.shift();
            var wrongPlayer = false //Here bot checks if there's a non-user string in 'mentioned users' sections
            console.log(args)
            args.forEach(u => {
                if (!u.startsWith('<@') || !u.endsWith('>')) {
                    msg.reply('указан неверный игрок!');
                    wrongPlayer = true;
                }
            });
            if (wrongPlayer) { return 1; }

            if (args[0]) { //If user defined players
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
                        c.overwritePermissions(msg.author, { //Overwrite permissions for the user so he can assecc and write in the channel
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
                        msg.reply(`был создан канал \'${name}\'. Не забудьте потом его удалить командой *.remove*!`)
                        createdChannels.set(msg.author, name) //Add user to the map so he can't spam channels
                    })
            } else {
                msg.reply("укажите хотя бы одного игрока для группы!")
            }
        } else {
            msg.reply("укажите игроков для игры и название группы!")
        }
    } else {
        msg.reply(`у Вас уже есть группа **#${createdChannels.get(msg.author)}**!`)
    }
}