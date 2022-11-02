const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const { Users, User } = require('./utils/user')
const { Msg } = require('./utils/message')

const port = process.env.PORT || 3001
const app = express()

app.use(cors())
const server = http.createServer(app)

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
		const res = users.addUser(newUser)
		// console.log('User', newUser.name, 'connected' )
		// console.log(newUser)

		if (res) {
			const messageData = new Msg(newUser.room, 'system', `${newUser.name} has joined`)
			send(socket, false, '', 'userList', users.getUsersInRoom(newUser.room))
			send(socket, true, '', 'userList', users.getUsersInRoom(newUser.room))
	
			socket.join(newUser.room)
			send(socket, true, newUser.room, 'receiveMessage', messageData)
		} else {
			// console.log('error')
			send(socket, false, '', 'error', 'Already registered user')
		}
	})

	socket.on('sendMessage', (data) => {
		const message = new Msg(data.room, data.author, data.content, data.answer)
		// console.log(message)
		send(socket, true, data.room, 'receiveMessage', message)
	})

	socket.on('leaveRoom', () => disconnectUser(socket))
	socket.on('disconnect', () => disconnectUser(socket))
})

const disconnectUser = (socket) => {
	const user = users.getUser(socket.id)

	if (user) {
		users.removeUser(user.id)

		const messageData = new Msg(user.room, 'system', `${user.name} has left`)
		send(socket, true, user.room, 'receiveMessage', messageData)
		send(socket, true, user.room, 'userList', users.getUsersInRoom(user.room))

		// console.log(user.name, "disconnected")
	}
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