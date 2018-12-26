const express = require('express');
const socket = require('socket.io');

const app = express();

const server = app.listen(3000, () => {
  console.log('starting server on port 3000');
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
    //this.messages = [];
    //this.users = [];
  }
  // joinRoom(user) {
  //   this.users.push(user);
  // }
  addMessage(message) {
    this.messages.push(message);
  }
}

const io = socket(server);
var room1 = new Room('Room1');
var room2 = new Room('Room2');
var room3 = new Room('Room3');
const rooms = [ room1, room2, room3 ];
const users = [];
const questionsSets = [];

io.on('connection', socket => {
  console.log(`new connection from: ${socket.id}`);

  socket.on('enter-nick', data => {
    socket.join(data.user);
    // nowy user
    if (!/^[a-z0-9]+$/i.test(data.user)) {
      io.to(socket.id).emit('nickError', 'empty');
    } else if (users.filter(user => user.nick === data.user).length === 0) {
      users.push(new User(data.user, socket.id));
      console.log(users);
      console.log(`${socket.id} connected as ${data.user}`);
      io.to(socket.id).emit('connected', { user: data.user, rooms: rooms });
    } else {
      io.to(socket.id).emit('nickError', 'double');
    }
  });

  socket.on('createRoom', data => {
    if (!/^[a-z0-9]+$/i.test(data.room))
      io.to(socket.id).emit('roomNameError');
    else if (rooms.filter(room => room.name === data.room).length === 0){
      users.filter(user => user.id === socket.id)[0].joinRoom(data.room);
      console.log("joined room " + data.room);
      console.log(users);
      rooms.push(new Room(data.room));
      console.log(rooms);
      io.to(socket.id).emit('connectedToRoom', { user: users.filter(user => user.id === socket.id)[0].nick, rooms: rooms })
    } else {
      io.to(socket.id).emit('roomExists', { room: data.room });
    }
  });
});
