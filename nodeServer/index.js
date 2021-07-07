// node server for socketio connections
const io = require('socket.io')(5500);

// store users in our current session here
const users = {}

// to handle/listen all our events
io.on('connection', socket =>{
    // new user comes
    socket.on('new-user-joined', name =>{
        // console.log("New User ", name)
        users[socket.id] = name
        socket.emit('welcome', name)
        // broadcast it to everyone except ourselves
        socket.broadcast.emit('user-joined', name)
    })
    // msg send broadcast
    socket.on('send', message =>{
        // broadcast it to everyone except ourselves (we have done it for ourselves
        // in form event listener)
        // in client.js
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    })
    // when someone leaves the chat
    // disconnect is builtin event
    socket.on('disconnect', message =>{
        socket.broadcast.emit('leftChat', users[socket.id])
        // delete the user from our record
        // #PRIVACY OP
        delete users[socket.id]
    })
})
