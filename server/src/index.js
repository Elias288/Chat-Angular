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
		const res = users.addUser(newUser) //1 error, 0 spend

		if(res) {
			send(socket, false, '', 'error', 'Already registered user')
			return
		}

		send(socket, false, '', 'userList', users.users)
		send(socket, true, '', 'userList', users.users)
	})

	socket.on('joinRoom', (data) => {
		const user = users.getUserByName(data.name)
		
		if (!user) {
			send(socket, false, '', 'error', 'Non existent user')
			return
		}

		user.room = data.room
		console.log(user.name, 'connected to room:', data.room)
		
		const messageData = new Msg(user.room, 'system', `${user.name} has joined`)
		socket.join(user.room)
		send(socket, false, '', 'userList', users.getUsersInRoom(user.room))
		send(socket, true, user.room, 'userList', users.getUsersInRoom(user.room))

		send(socket, true, user.room, 'receiveMessage', messageData)
	})

	socket.on('sendMessage', (data) => {
		const message = new Msg(data.room, data.author, data.content, data.answer)
		// console.log(message)
		send(socket, true, data.room, 'receiveMessage', message)
	})

	socket.on('leaveRoom', () => {
		const user = users.getUserBySocketId(socket.id)

		if (!user || user.room == undefined) {
			send(socket, false, '', 'error', 'User or room not found')
			return
		}
		
		console.log(user.name, "disconnect to room:", user.room)
		const messageData = new Msg(user.room, 'system', `${user.name} has left of the room`)
		send(socket, true, user.room, 'receiveMessage', messageData)
		send(socket, true, user.room, 'userList', users.getUsersInRoom(user.room))
		users.room = undefined;
	})

	socket.on('leave', () => disconnectUser(socket))
	socket.on('disconnect', () => disconnectUser(socket))
})

const disconnectUser = (socket) => {
	const user = users.getUserBySocketId(socket.id)
	if (user) {
		users.removeUser(user.id)
		
		send(socket, true, '', 'userList', users.users)
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