import { container, socket } from './index';
import { genThirdView } from './third';

export const genSecondView = (nick, rooms) => {
  const header = document.createElement('div');
  container.appendChild(header);

  const h1 = document.createElement('h1');
  h1.innerHTML = `Hey ${nick}`;
  header.appendChild(h1);

  const text = document.createElement('div');
  text.setAttribute('id', 'text');
  header.appendChild(text);

  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.classList.add("wideInput");
  input.classList.add("inputNotError");
  input.setAttribute('placeholder', 'create new room')
  text.appendChild(input);
  
  const br = document.createElement('br');
  text.appendChild(br);
  
  const style = document.createElement('div');
  style.classList.add("style");
  style.setAttribute('id', 'style');
  style.innerHTML = 'or choose one';
  text.appendChild(style);

  const content = document.createElement('div');
  container.appendChild(content);

  const roomList = document.createElement('div');
  roomList.setAttribute('id', 'roomList');
  roomList.classList.add('scroll');
  content.appendChild(roomList);

  const button = document.createElement('button');
  button.innerHTML = 'JOIN';
  button.setAttribute('id', 'button');
  container.appendChild(button);

  for (const room of rooms) {
    let roomName = document.createElement('li');
    roomName.innerHTML = room.name;
    roomList.appendChild(roomName);
  }

  input.addEventListener('click', () => {
    button.innerHTML = 'CREATE';
  });

  roomList.addEventListener('click', () => {
    button.innerHTML = 'JOIN';
  });

  button.addEventListener('click', () => {
    socket.emit('createRoom', { room: input.value });
  });

  socket.on('roomExists', data => {
    style.innerHTML = 'room already exists';
    style.classList.add("error");

    input.classList.remove("inputNotError");
    input.classList.add("inputError");
    input.value = '';

    const elem = document.getElementById('roomList');
    elem.parentNode.removeChild(elem);
    const roomList = document.createElement('div');

    const existingRooom = document.createElement('li');
    existingRooom.classList.add("doubledRoom");
    existingRooom.innerHTML = data.room;
    roomList.appendChild(existingRooom);

    for (const room of rooms) {
      if (room.name != data.room) {
        const roomName = document.createElement('li');
        roomName.innerHTML = room.name;
        roomList.appendChild(roomName);
      }
    }
    roomList.setAttribute('id', 'roomList');
    container.appendChild(roomList);
    document.getElementById('roomList').style.height = 
      (document.getElementById('button').offsetTop 
      - document.getElementById('roomList').offsetTop - 30) + 'px';
    container.appendChild(roomList);

    button.innerHTML = "JOIN";

    input.addEventListener('click', () => {
      button.innerHTML = 'CREATE';
    });

    roomList.addEventListener('click', () => {
      button.innerHTML = 'JOIN';
    });
  });

  socket.on('roomNameError', () => {
    input.value='';
    input.classList.add("inputError");
    style.innerHTML = '';
    style.innerHTML = 'only letters and numbers are allowed';
    style.classList.add("error");
  });

  socket.on('connectedToRoom', data => {
    socket.off('connectedToRoom');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    genThirdView(data.user, data.room);
  });
};
