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
  style.innerHTML = 'or choose one';
  text.appendChild(style);

  const button = document.createElement('button');
  button.innerHTML = 'JOIN';
  button.setAttribute('id', 'button');
  container.appendChild(button);

  const roomList = document.createElement('div');
  roomList.setAttribute('id', 'roomList');
  container.appendChild(roomList);
  document.getElementById('roomList').style.height = (document.getElementById('button').offsetTop - document.getElementById('roomList').offsetTop - 30) + 'px';
  
  // sending message
  button.addEventListener('click', () => {
    socket.emit('message', { message: input.value, room: nick });
  });

  // getting message
  socket.on('message', data => {
    const newMessage = document.createElement('li');
    console.log(data);
    newMessage.innerHTML = data.message;
    roomList.appendChild(newMessage);
  });
};
