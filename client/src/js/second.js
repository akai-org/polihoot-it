import { container, socket } from './index';

export const genSecondView = roomName => {
  const p = document.createElement('p');
  p.innerHTML = `connected to ${roomName}`;
  container.appendChild(p);
  const input = document.createElement('input');
  container.appendChild(input);
  const button = document.createElement('button');
  button.innerHTML = 'send message';
  container.appendChild(button);
  const messageBox = document.createElement('div');
  container.appendChild(messageBox);

  // sending message
  button.addEventListener('click', () => {
    socket.emit('message', { message: input.value, room: roomName });
  });

  // getting message
  socket.on('message', data => {
    const newMessage = document.createElement('p');
    console.log(data);
    newMessage.innerHTML = data.message;
    container.appendChild(newMessage);
  });
};
