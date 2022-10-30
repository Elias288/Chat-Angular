class Msg {
    constructor(room, author, content) {
        this.room = room;
        this.author = author;
        this.content = content;
        this.time = new Date().toTimeString().split(' ')[0];
    }
}

module.exports = { Msg };