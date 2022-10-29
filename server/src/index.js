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
		const newUser = new User(socket.id, data.name, data.room)
		users.addUser(newUser)

		console.log('User', newUser.name, 'connected' )
		// console.log('Cantidad de Usuario conectados: ' + users.getCantidadUsuarios())

		const messageData = new Msg(newUser.room, 'system', `${newUser.name} has joined`)

		socket.emit('userList', users.getUsersInRoom(newUser.room))
		socket.broadcast.emit('userList', users.getUsersInRoom(newUser.room))

		socket.join(newUser.room)
		socket.broadcast.to(newUser.room).emit('receiveMessage', messageData)
	})

	socket.on('sendMessage', (data) => {
		const message = new Msg(data.room, data.author, data.content)
		// console.log(message)
		socket.to(data.room).emit('receiveMessage', message)
	})

	socket.on('leaveRoom', () => disconnectUser(socket))
	socket.on('disconnect', () => disconnectUser(socket))
})

const disconnectUser = (socket) => {
	const user = users.getUser(socket.id)

	if (user) {
		users.removeUser(user.id)

		const messageData = new Msg(user.room, 'system', `${user.name} has left`)
		socket.broadcast.to(user.room).emit('receiveMessage', messageData)
		socket.broadcast.to(user.room).emit('userList', users.getUsersInRoom(user.room))

		console.log(user.name, "disconnected")
	}
}

server.listen(port, () => {
	console.log(`escuchando en *${port}`)
})