const { v4: uuidv4 } = require('uuid');

class Users {
    users = []

    constructor () {}

    addUser (user) {
        if (this.users.some(u => u.name === user.name)){
            return 0
        } else {
            this.users.push(user)
            return 1
        }
    }

    getUser(id){
        return this.users.find((user) => user.id === id)
    }

    // getUserPeronalIdByName (name) {
    //     const user = this.users.find((user) => user.name === name)
    //     return user.personalId
    // }

    getUsersInRoom (room) {
        return this.users.filter(user => user.room === room)
    }

    removeUser (id) {
        const index = this.users.findIndex((user) => user.id === id )
        if (index !== -1) return this.users.splice(index, 1)[0]
    }
}

class User {
    id = ""
    personalId = ""
    name = ""
    room = ""

    constructor(id, personalId, name, room){
        this.id = id
        this.personalId = personalId

        const uuid = uuidv4().replace(/-/g, '')
        this.name = name == undefined || name == '' ? 'guest-' + uuid.substring(0, 8) : name.trim().toLowerCase()
        this.room = room == undefined || room == '' ? uuid : room.trim().toLowerCase()
    }
}

module.exports = {
    User,
    Users
}