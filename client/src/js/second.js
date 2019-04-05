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
  content.classList.add('scroll');
  container.appendChild(content);

  const roomList = document.createElement('div');
  roomList.setAttribute('id', 'roomList');
  content.appendChild(roomList);

  const button = document.createElement('button');
  button.innerHTML = 'JOIN';
  button.setAttribute('id', 'button');
  container.appendChild(button);

  for (const room of rooms) {
    let roomName = document.createElement('li');
    roomName.innerHTML = room.name;
    roomList.appendChild(roomName);
    roomName.addEventListener('click', () => {
      const lis = document.getElementsByTagName('li');
      for (let i = 0; i<lis.length; i++) {
        lis[i].classList.remove('active');
      }
      roomName.classList.add('active');
    });
  }

  input.addEventListener('click', () => {
    button.innerHTML = 'CREATE';
  });

  roomList.addEventListener('click', () => {
    button.innerHTML = 'JOIN';
  });

  button.addEventListener('click', () => {
    if (button.innerHTML === 'CREATE') {
      socket.emit('createRoom', { room: input.value });
    } else if (button.innerHTML === 'JOIN') {
      const lis = document.getElementsByTagName('li');
      for (let i = 0; i < lis.length; i++) {
        if (lis[i].classList[0] === 'active')
          socket.emit('joinRoom', { room: lis[i].innerHTML });
      }
    } else console.log("err: second.js/createRoom")
  });

  socket.on('roomExists', data => { // do poprawy
    style.innerHTML = 'room already exists';
    style.classList.add("error");

    input.classList.remove("inputNotError");
    input.classList.add("inputError");
    input.value = '';

    const elem = document.getElementById('roomList');
    elem.parentNode.removeChild(elem);
    const roomList = document.createElement('div');
    roomList.setAttribute('id', 'roomList');
    content.appendChild(roomList);

    const existingRooom = document.createElement('li');
    existingRooom.innerHTML = data.room;
    existingRooom.classList.add("active");
    existingRooom.addEventListener('click', () => {
      const lis = document.getElementsByTagName('li');
      for (let i = 0; i<lis.length; i++) {
        lis[i].classList.remove('active');
      }
      existingRooom.classList.add('active');
    });
    roomList.appendChild(existingRooom);

    for (const room of rooms) {
      if (room.name != data.room) {
        let roomName = document.createElement('li');
        roomName.innerHTML = room.name;
        roomList.appendChild(roomName);
        roomName.addEventListener('click', () => {
          const lis = document.getElementsByTagName('li');
          for (let i = 0; i < lis.length; i++) {
            lis[i].classList.remove('active');
          }
          roomName.classList.add('active');
        });
      }
    }
    roomList.setAttribute('id', 'roomList');
    content.appendChild(roomList);

    button.innerHTML = 'JOIN';
  
    input.addEventListener('click', () => {
      button.innerHTML = 'CREATE';
    });
  
    roomList.addEventListener('click', () => {
      button.innerHTML = 'JOIN';
    });
  
    button.addEventListener('click', () => {
      if (button.innerHTML === 'CREATE') {
        socket.emit('createRoom', { room: input.value });
      } else if (button.innerHTML === 'JOIN') {
        const lis = document.getElementsByTagName('li');
        for (let i = 0; i < lis.length; i++) {
          if (lis[i].classList[0] === 'active')
            socket.emit('joinRoom', { room: lis[i].innerHTML });
        }
      } else console.log("err: second.js/createRoom")
    });
  });

  socket.on('roomNameError', () => {
    input.value='';
    input.classList.add("inputError");
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
