import { container, socket } from './index';

export const genSecondView = nick => {
  const h1 = document.createElement('h1');
  h1.innerHTML = `Hey ${nick}`;
  container.appendChild(h1);

  const text = document.createElement('div');
  text.setAttribute('id', 'text');
  container.appendChild(text);

  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('style', "width: 70%; max-width: 500px;");
  input.setAttribute('placeholder', 'create new room')
  text.appendChild(input);
  
  const br = document.createElement('br');
  text.appendChild(br);
  
  const style = document.createElement('div');
  style.setAttribute('style', 'margin-top: 4em; color: #ccc;');
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

  //example room list
  for (var i = 10; i >= 0; i--) {
    var roomName = document.createElement('li');
    roomName.innerHTML = i;
    roomList.appendChild(roomName);
  }

  // sending message
  button.addEventListener('click', () => {
    socket.emit('createRoom', { room: input.value });
  });

  // response from server
  socket.on('roomExists', data => {
    document.getElementById('style').innerHTML = 'room already exists';
    document.getElementById('style').style.color = "red";

    var inputs = document.getElementsByTagName('input');
    inputs[0].borderBottom = "1px solid red";
    inputs[0].value = '';

    const newRoom = document.createElement('li');
    newRoom.setAttribute('style', 'color: #20c120; border-bottom: 1px solid #20c120;')
    newRoom.innerHTML = data.room;
    document.getElementById('roomList').insertBefore(newRoom, document.getElementById('roomList').childNodes[0]);
  });

  socket.on('connectedToRoom', data => {
    socket.off('connectedToRoom');
    // remove all items from container
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    // call gen should be third view not second
    genSecondView(data.user);
  });
};
