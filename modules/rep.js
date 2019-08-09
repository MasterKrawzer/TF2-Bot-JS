const fs = require('fs')
module.exports = (msg, args) => {
    var db = JSON.parse(fs.readFileSync('database.json')) //Get the database 
        var getter = msg.author
        var sender = msg.mentions.users.first()
        
        if (sender == undefined) { //Check if user isn't defined
            msg.reply('не указан пользователь!')
            return 1
        }

        if (db[getter.id]["rep"] < args[1]) { //Checking if user got enough reputation
            msg.reply(`Невозможно отправить столько репутации!\n${args[1]} rep > ${db[getter.id]["rep"]} rep`)
            return 1
        }
        db[sender.id]["rep"] = parseInt(db[sender.id]["rep"]) + parseInt(args[1]) //Transmitting reputation
        db[getter.id]["rep"] = parseInt(db[getter.id]["rep"]) - parseInt(args[1])
        fs.writeFile('database.json', JSON.stringify(db, null, 2), (error) => { //Saving the database
            if (error) {
                console.log(error)
            } else {
                msg.reply("Успешно передана репутация пользователю " + sender.username + '!')
            }
        })
}