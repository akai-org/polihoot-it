import { container, socket } from './index';

export const genSecondView = (nick, rooms) => {
  const h1 = document.createElement('h1');
  h1.innerHTML = `Hey ${nick}`;
  container.appendChild(h1);

  const text = document.createElement('div');
  text.setAttribute('id', 'text');
  container.appendChild(text);

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

  const button = document.createElement('button');
  button.innerHTML = 'JOIN';
  button.setAttribute('id', 'button');
  container.appendChild(button);

  const roomList = document.createElement('div');
  roomList.setAttribute('id', 'roomList');
  container.appendChild(roomList);
  document.getElementById('roomList').style.height = 
    (document.getElementById('button').offsetTop 
    - document.getElementById('roomList').offsetTop - 30) + 'px';

  for (var i = rooms.length-1; i >= 0; i--) {
    var roomName = document.createElement('li');
    roomName.innerHTML = rooms[i].name;
    roomList.appendChild(roomName);
  }

  button.addEventListener('click', () => {
    socket.emit('createRoom', { room: input.value });
  });

  socket.on('roomExists', data => {
    document.getElementById('style').innerHTML = 'room already exists';
    document.getElementById('style').classList.add("error");

    var inputs = document.getElementsByTagName('input');
    input.classList.remove("inputNotError");
    inputs[0].classList.add("inputError");
    inputs[0].value = '';

    var elem = document.getElementById('roomList');
    elem.parentNode.removeChild(elem);
    const roomList = document.createElement('div');

    const existingRooom = document.createElement('li');
    existingRooom.classList.add("doubledRoom");
    existingRooom.innerHTML = data.room;
    roomList.appendChild(existingRooom);

    for (var i = rooms.length-1; i >= 0; i--) {
      if (rooms[i].name != data.room) {
        var roomName = document.createElement('li');
        roomName.innerHTML = rooms[i].name;
        roomList.appendChild(roomName);
      }
    }
    roomList.setAttribute('id', 'roomList');
    container.appendChild(roomList);
    document.getElementById('roomList').style.height = 
      (document.getElementById('button').offsetTop 
      - document.getElementById('roomList').offsetTop - 30) + 'px';
    container.appendChild(roomList);
  });

  socket.on('roomNameError', () => {
    var inputs = document.getElementsByTagName('input');
    inputs[0].value='';
    inputs[0].classList.add("inputError");
    document.getElementById('style').innerHTML = '';
    document.getElementById('style').innerHTML = 'only letters and numbers are allowed';
    document.getElementById('style').classList.add("error");
  });

  socket.on('connectedToRoom', data => {
    socket.off('connectedToRoom');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    //should be third view not second
    genSecondView(data.user, data.rooms);
  });
};
