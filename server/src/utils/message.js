class Msg {
    constructor(room, author, content, answer) {
        this.room = room;
        this.author = author;
        this.content = content;
        this.answer = answer
        this.time = new Date().toTimeString().split(' ')[0];
    }
}

module.exports = { Msg };