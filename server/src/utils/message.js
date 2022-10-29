class Msg {
    constructor(room, author, content) {
        this.room = room;
        this.author = author;
        this.content = content;
        this.time = new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes() + ':' + new Date(Date.now()).getSeconds()
    }
}

module.exports = { Msg };