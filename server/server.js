const express = require('express');
const socket = require('socket.io');

const app = express();

const server = app.listen(3000, () => {
  ;
});

class User {
  constructor(nick, id) {
    this.nick = nick;
    this.id = id;
    this.room = '';
    this.score = 0;
  }
  joinRoom(roomName) {
    this.room = roomName;
  }
  updateScore() {
    this.score++;
  }
}

class Room {
  constructor(name) {
    this.name = name;
  }
  addMessage(message) {
    this.messages.push(message);
  }
}

const io = socket(server);
const rooms = [ new Room('Room14'),new Room('Room13'),new Room('Room12'),new Room('Room11'),new Room('Room10'),new Room('Room9'),new Room('Room8'),new Room('Room7'),new Room('Room6'),new Room('Room5'),new Room('Room4'),new Room('Room3'), new Room('Room2'), new Room('Room1') ];
const users = [];

io.on('connection', socket => {

  socket.on('enter-nick', data => {
    socket.join(data.user);
    if (!/^[a-z0-9]+$/i.test(data.user)) {
      io.to(socket.id).emit('nickError', 'empty');
    } else if (users.filter(user => user.nick === data.user).length === 0) {
      users.push(new User(data.user, socket.id));
      io.to(socket.id).emit('connected', { user: data.user, rooms: rooms });
    } else {
      io.to(socket.id).emit('nickError', 'double');
    }
  });

  socket.on('createRoom', data => {
    if (!/^[a-z0-9]+$/i.test(data.room))
      io.to(socket.id).emit('roomNameError');
    else if (!rooms.some(el => el.name === data.room)){
      users.filter(user => user.id === socket.id)[0].joinRoom(data.room);
      rooms.unshift( new Room(data.room) );
      io.to(socket.id).emit('connectedToRoom', { user: users.filter(user => user.id === socket.id)[0], room: rooms[0] })
    } else if (rooms.some(el => el.name === data.room)) {
      io.to(socket.id).emit('roomExists', { room: data.room });
    }
  });
});
