const { v4: uuidv4 } = require('uuid');

class Users {
    users = []

    constructor(){}

    addUser(user){
        this.users.push(user)
    }

    getCantidadUsuarios(){
        return this.users.length
    }

    getUser(id){
        return this.users.find((user) => user.id === id)
    }

    getUsersInRoom(room){
        return this.users.filter(user => user.room === room)
    }

    removeUser(id){
        const index = this.users.findIndex((user) => user.id === id )
        if (index !== -1) return this.users.splice(index, 1)[0]
    }
}

class User {
    constructor(id, name, room){
        this.id = id
        const roomId = uuidv4()
        this.name = name == undefined ? 'guest-' + roomId.substring(0, 8) : name.trim().toLowerCase()
        this.room = room == undefined ? roomId : room.trim().toLowerCase()
    }
}

module.exports = {
    User,
    Users
}