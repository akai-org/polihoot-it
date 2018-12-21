import { container, socket } from './index';
import { genSecondView } from './second';

export const genFirstView = () => {
  const h1 = document.createElement('h1');
  h1.innerHTML = 'Polihood-it';
  container.appendChild(h1);

  const text = document.createElement('div');
  text.setAttribute('id', text);
  container.appendChild(text);

  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', 'nick');
  text.appendChild(input);

  const button = document.createElement('button');
  button.innerHTML = 'ENTER';
  container.appendChild(button);

  // join room
  button.addEventListener('click', () => {
    socket.emit('join-room', { room: input.value });
  });

  // response from server
  socket.on('connected-to-room', data => {
    socket.off('connected-to-room');
    // remove all items from container
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    // call gen second view
    genSecondView(data.room);
  });
};
