const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const { Users, User } = require('./utils/user')
const { Msg } = require('./utils/message')

const { author, license, name, description } = require('../package.json');

const port = process.env.PORT || 3001
const app = express()

app.use(cors())
const server = http.createServer(app)

app.get('/', (req, res) => {
    res.send({
		name,
		author,
		description,
		"frontEnd": "https://elelichatangular.netlify.app/",
		license, 
	})
})

const whiteList = [ 'http://localhost:4200', 'https://elelichatangular.netlify.app' ]
const io = new Server(server, {
	cors: {
		origin: whiteList,
		methods: ['GET', 'POST']
	}
})

const users = new Users()

io.on('connection', (socket) => {
	
	socket.on('join', (data) => {
		const newUser = new User(socket.id, data.personalId, data.name, data.room)
		const res = users.addUser(newUser) // true == added; false == not added

		if (!res) {
			send(socket, false, '', 'error', 'S - Already registered user')
			return
		}

		const messageData = new Msg(newUser.room, 'system', `${newUser.name} has joined`)
		socket.join(newUser.room)

		send(socket, false, "", 'userList', users.getUsersInRoom(newUser.room))
		send(socket, true, newUser.room, 'userList', users.getUsersInRoom(newUser.room))
		send(socket, true, newUser.room, 'receiveMessage', messageData)
	})

	socket.on('sendMessage', (data) => {
		const message = new Msg(data.room, data.author, data.content, data.answer)
		send(socket, true, data.room, 'receiveMessage', message)
	})

	socket.on('leaveRoom', () => disconnectUser(socket))
	socket.on('disconnect', () => disconnectUser(socket))
})

const disconnectUser = (socket) => {
	const user = users.getUser(socket.id)

	if (!user) {
		send(socket, false, '', 'error', 'S - User not found')
		return
	}

	users.removeUser(user.id)
	const messageData = new Msg(user.room, 'system', `${user.name} has left`)
	send(socket, true, user.room, 'receiveMessage', messageData)
	send(socket, true, user.room, 'userList', users.getUsersInRoom(user.room))
}

const send = (socket, broadcast, room, direction, message) => {
	broadcast 
		? room !== '' 
			? socket.broadcast.to(room).emit(direction, message) 
			: socket.broadcast.emit(direction, message)
		: room !== '' 
			? socket.to(room).emit(direction, message) 
			: socket.emit(direction, message)
}

server.listen(port, () => {
	console.log(`escuchando en *${port}`)
})