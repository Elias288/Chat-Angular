const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

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

io.on('connection', (socket) => {
    console.log('Usuario conectado: ' + socket.id)
	
	socket.on('disconnect', () => {
		console.log('Usuario desconectado: ' + socket.id)
	})
})

server.listen(port, () => {
	console.log(`escuchando en *${port}`)
})