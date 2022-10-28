const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const { Users, User } = require('./utils/user')

const port = process.env.PORT || 3001
const app = express()

app.use(cors())
const server = http.createServer(app)

const whiteList = [ 'http://localhost:4200' ]
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

		console.log('Usuario conectado: ', newUser.name)
		// console.log('Cantidad de Usuario conectados: ' + users.getCantidadUsuarios())

		// const messageData = {
		// 	room: newUser.room,
		// 	author: 'sistema',
		// 	message: `${newUser.name} se ha unido`,
		// 	time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes() + ':' + new Date(Date.now()).getSeconds()
		// }

		socket.emit('userList', users.getUsersInRoom(newUser.room))
		socket.broadcast.emit('userList', users.getUsersInRoom(newUser.room))

		socket.join(newUser.room)
		// console.log(users.getUsersInRoom(newUser.room));

		// socket.broadcast.to(newUser.room).emit('receiveMessage', messageData)
		// socket.to(newUser.room).emit('UserList', users.getUsersInRoom(newUser.room))

	})
	
	socket.on('disconnect', () => {
		const user = users.getUser(socket.id)

		if (user) {
			users.removeUser(user.id)
	
			console.log('Usuario desconectado: ' + user.name)
			// console.log('Cantidad de Usuario conectados: ' + users.getCantidadUsuarios())
		}
	})
})

server.listen(port, () => {
	console.log(`escuchando en *${port}`)
})