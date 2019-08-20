// Required Modules
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Middleware and config
app.use('/', express.static('static'));

// Global vars
var players = {};

// Socket.io
io.on('connection', function (socket) {

    socket.on('register-player', function (initials) {
      // each socket has a unique id
      players[socket.id] = initials;
      io.emit('update-player-list', Object.keys(players).map(id => players[id]));
    });

    socket.on('add-circle', function (data) {
      io.emit('add-circle', data);
    });

    socket.on('clear-display', function () {
      io.emit('clear-display');
    });

    // when the player disconnects, remove key & notify clients
    socket.on('disconnect', function () {
      delete players[socket.id];
      io.emit('update-player-list', Object.keys(players).map(id => players[id]));
    });

});

// Home route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// Listen!
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Server is now listening on port:', PORT)
})
