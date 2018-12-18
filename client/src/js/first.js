import { container, socket } from './index';
import { genSecondView } from './second';

export const genFirstView = () => {
  const input = document.createElement('input');
  container.appendChild(input);
  const button = document.createElement('button');
  button.innerHTML = 'connect';
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
