const fs = require('fs')
module.exports = (msg) => {
    if (msg.author.id == "315339158912761856") {
        var db = new Object();
        msg.guild.members.forEach(m => {
            if (m.roles.has("548744682172186626")) { //If user's an admin
                db[m.id] = {
                    "rep": 1000,
                    "mge": 0
                }
            } else if (m.roles.has("548744536512528391")) { //If user's a moderator
                db[m.id] = {
                    "rep": 500,
                    "mge": 0
                }
            } else { //If user's is a mortal
                db[m.id] = {
                    "rep": 0,
                    "mge": 0
                }
            }
        })
        fs.writeFile('database.json', JSON.stringify(db, null, 2), () => { return }) //Save that bs
        console.log("Succesfully initilized and reset user's stats")
    }
}