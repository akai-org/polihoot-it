const express = require('express');
const socket = require('socket.io');

const app = express();

const server = app.listen(3000, () => {
  console.log('starting server on port 3000');
});

const io = socket(server);

const rooms = [];

class Room {
  constructor(name) {
    this.name = name;
    this.messages = [];
  }
  addMessage(message) {
    this.messages.push(message);
  }
}

io.on('connection', socket => {
  console.log(`new connection from: ${socket.id}`);

  socket.on('join-room', data => {
    socket.join(data.room);
    // nowy pokoj
    if (rooms.filter(room => room.name === data.room).length === 0) {
      rooms.push(new Room(data.room));
      console.log(rooms);
    }
    console.log(`${socket.id} connected-to-room ${data.room}`);
    io.emit('connected-to-room', { room: data.room });
  });

  socket.on('message', data => {
    io.to(data.room).emit('message', { message: data.message });
    const room = rooms.filter(room => room.name === data.room)[0];
    room.addMessage(data.message);
    console.log(room.messages);
  });
});
