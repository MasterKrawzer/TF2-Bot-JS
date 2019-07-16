const config = require('../config.json')
module.exports = (msg) => {
    if (msg.member.roles.has(config.adminRole) || msg.member.roles.has(config.moderatorRole) || msg.member.roles.has(config.curatorRole)) {
        let message = "";
        message += 'Итак, для отправки новостей используется следующий синтаксис:\n';
        message += 'Cпособ 1: отправка простого сообщения -- `.send-news simple <ваш_текст>`\n';
        message += 'Способ 2: отправка сложного сообщения -- `.send-news embed <цвет_сообщения>(можно не указывать) "<заголовок_поля>;<текст_поля>"`\n'
        message += 'Таких полей может быть не более 25. В каждом <тексте_поля> можно использовать Markdown, но его нельзя использовать в заголовках.\n';
        message += 'Примеры этих сообщений есть в новостном чате. Перед отправкой новостей просьба хорошенько подумать. Потому что их может удалять только модераторы и выше.\n';
        message += 'Цвет новости нужно отправлять как hex код цвета, или использовать готовый цвет. *Список готовых цветов можно посмотреть командой .colors (отправлять мне)*.\n';
        msg.author.send(message);
    }
    msg.delete();
    return 0;
}