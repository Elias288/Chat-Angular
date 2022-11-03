class Msg {
    constructor(room, author, content, answer) {
        this.room = room;
        this.author = author;
        this.content = content;
        this.answer = answer
    }
}

module.exports = { Msg };