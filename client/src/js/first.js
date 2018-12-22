import { container, socket } from './index';
import { genSecondView } from './second';

const nickError = () => {
  var inputs = document.getElementsByTagName('input');
  inputs[0].value='';
  inputs[0].style.borderBottom='1px solid red';

  const br = document.createElement('br');
  text.appendChild(br);
  
  const error = document.createElement('div');
  error.setAttribute('style', 'margin-top: 4em; color: red;');
  error.innerHTML = 'that nick is taken';
  text.appendChild(error);
};

export const genFirstView = () => {
  const h1 = document.createElement('h1');
  h1.innerHTML = 'Polihood-it';
  container.appendChild(h1);

  const text = document.createElement('div');
  text.setAttribute('id', 'text');
  container.appendChild(text);

  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', 'nick');
  text.appendChild(input);

  const button = document.createElement('button');
  button.innerHTML = 'ENTER';
  container.appendChild(button);

  // enter nick
  button.addEventListener('click', () => {
    socket.emit('enter-nick', { user: input.value });
  });

  // response from server
  socket.on('nickError', () => {
    nickError();
  });

  socket.on('connected', data => {
    socket.off('connected');
    // remove all items from container
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    // call gen second view
    genSecondView(data.user);
  });

  // // response from server
  // socket.on('connected-to-room', data => {
  //   socket.off('connected-to-room');
  //   // remove all items from container
  //   while (container.firstChild) {
  //     container.removeChild(container.firstChild);
  //   }
  //   // call gen second view
  //   genSecondView(data.room);
  // });
};
