module.exports = (msg, args) => {
    if (args[0]) {
        let choice = Math.floor(Math.random() * (3 + 1 - 1)) + 1
        console.log(choice)
        if (choice == 1) {
            switch (args[0].toLocaleLowerCase().trim()) {
                case "rock":
                    msg.reply("Камень. Ничья.")
                    break
                case "paper":
                    msg.reply("Камень. Ладно, ты выиграл...")
                case "scissors":
                    msg.reply("Камень. Я выиграл!")
                    break
                default:
                    break
            }
        }

        if (choice == 2) {
            switch (args[0].toLocaleLowerCase().trim()) {
                case "rock":
                    msg.reply("Ножницы. Ты выиграл.")
                    break
                case "paper":
                    msg.reply("Ножницы. Хаха!")
                case "scissors":
                    msg.reply("Ножницы. Ничья.")
                    break
                default:
                    break
            }
        }

        if (choice == 3) {
            switch (args[0].toLocaleLowerCase().trim()) {
                case "rock":
                    msg.reply("Бумага. Ладно...")
                    break
                case "paper":
                    msg.reply("Бумага. Ничья")
                case "scissors":
                    msg.reply("Бумага. Моя взяла!")
                    break
                default:
                    break
            }
        }

    } else {
        msg.reply("Ммм, ты собираешься выбирать?")
    }
    return 0;
}