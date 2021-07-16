const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath)) //serves up public folder

//listen for new connections and emissions
io.on('connection', (socket) => {
    console.log('New web socket connection')

    socket.on('join', ({username, room}) =>{
        socket.join(room)

        socket.emit('message',  generateMessage(`Welcome to the ${room} chatroom`))
    
        socket.broadcast.to(room).emit('message',generateMessage(`${username} has joined}`))

        //socket.emit sends to current connections, 
        //io.emit sends to all connections 
        //socket.broadcast.emit sends to all connections except emitter
        //io.to.emit emits event to everyone in specific room
        //socket.broadcast.to.emit sends to everyone in specific room except emitter
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }
        io.to(room).emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.to(room).emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        io.to(room).emit('message', generateMessage('A user has left the chat'))
    })
})



server.listen(port, () => {
    console.log(`App listening at port ${port}`)
})