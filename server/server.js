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
    this.answered = false;
  }
  joinRoom(roomName) {
    this.room = roomName;
  }
  // leaveRoom() {
  //   this.room = '';
  // }
  updateScore() {
    this.score++;
  }
  answered(state) {
    this.answered = state;
  }
}

class Room {
  constructor(name) {
    this.name = name;
    this.users = [];
    this.usersCount = 0;
    this.answers = [0,0,0,0];
  }
  answer(ans) {
    this.answers[ans] += 1;
  }
  addUser(user) {
    this.users.push(user);
    this.usersCount++;
  }
  // removeUser(user) {
  //   this.users = users.filter(us => us !== user)[0];
  //   this.usersCount--;
  // }
}

const io = socket(server);
const rooms = [ new Room('Room14'),new Room('Room13'),new Room('Room12'),new Room('Room11'),new Room('Room10'),new Room('Room9'),new Room('Room8'),new Room('Room7'),new Room('Room6'),new Room('Room5'),new Room('Room4'),new Room('Room3'), new Room('Room2'), new Room('Room1') ];
const users = [];

io.on('connection', socket => {

  socket.on('enter-nick', data => {
    socket.join(data.user);
    if (!/^[a-z0-9ąśęćńłóżź]+$/i.test(data.user)) {
      io.to(socket.id).emit('nickError', 'empty');
    } else if (users.filter(user => user.nick === data.user).length === 0) {
      users.push(new User(data.user, socket.id));
      io.to(socket.id).emit('connected', { user: data.user, rooms: rooms });
    } else {
      io.to(socket.id).emit('nickError', 'double');
    }
  });

  socket.on('createRoom', data => {
    let user = users.filter(user => user.id === socket.id)[0];
    if (!/^[a-z0-9]+$/i.test(data.room))
      io.to(socket.id).emit('roomNameError');
    else if (!rooms.some(el => el.name === data.room)){
      user.joinRoom(data.room);
      rooms.unshift( new Room(data.room) );
      rooms[0].addUser(user);
      io.to(socket.id).emit('connectedToRoom', { user: user, room: rooms[0], rooms: rooms })
    } else if (rooms.some(el => el.name === data.room)) {
      io.to(socket.id).emit('roomExists', { room: data.room });
    }
  });

  socket.on('joinRoom', data => {
    let user = users.filter(user => user.id === socket.id)[0];
    let room = rooms.filter(room => room.name === data.room)[0];
    user.joinRoom(data.room);
    room.addUser(user);
    io.to(socket.id).emit('connectedToRoom', { user: user, room: room, rooms: rooms })
  });

  socket.on('vote', data => {
    let user = users.filter(user => user.id === socket.id)[0];
    let room = rooms.filter(room => room.name === data.room.name)[0];
    room.answer(data.vote);
    user.answered = true;
    let usersWhoVoted = users.filter(u => u.room === user.room).filter(u => u.answered === true);
    usersWhoVoted = usersWhoVoted.map(u => {return u.id});
    console.log(data.room.name, usersWhoVoted);
    // usersWhoVoted.forEach(id => { io.to(id).emit('voted', { answers: room.answers }) });
    // socket.broadcast.emit('voted', { answers: room.answers });
    io.sockets[usersWhoVoted].emit('voted', { answers: room.answers });
  });

  // socket.on('leaveRoom', data => {
  //   let user = users.filter(user => user.id === socket.id)[0];
  //   let room = rooms.filter(room => room.name === data.room)[0];
  //   user.leaveRoom();
  //   room.removeUser(user);
  // });
});
