import { container, socket } from './index';
import { genSecondView } from './second';

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
  button.setAttribute('id', 'button');
  container.appendChild(button);

  
  const description = document.createElement('div');
  description.setAttribute('id', 'description');
  container.appendChild(description);
  document.getElementById('description').style.height = 
    (document.getElementById('button').offsetTop 
    - document.getElementById('description').offsetTop - 30) + 'px';
  document.getElementById('description').innerHTML = 'Jakiś fajny opis: Lorem Ipsum jest tekstem stosowanym jako przykładowy wypełniacz w przemyśle poligraficznym. Spopularyzował się w latach 60. XX w. wraz z publikacją arkuszy Letrasetu, zawierających fragmenty Lorem Ipsum, a ostatnio z zawierającym różne wersje Lorem Ipsum oprogramowaniem przeznaczonym do realizacji druków na komputerach osobistych, jak Aldus PageMaker';

  // enter nick
  button.addEventListener('click', () => {
    socket.emit('enter-nick', { user: input.value });
  });

  // response from server
  socket.on('nickError', () => {
    var inputs = document.getElementsByTagName('input');
    inputs[0].value='';
    inputs[0].style.borderBottom='1px solid red';

    const br = document.createElement('br');
    text.appendChild(br);
    
    const error = document.createElement('div');
    error.setAttribute('style', 'margin-top: 4em; color: red;');
    error.innerHTML = 'that nick is taken';
    text.appendChild(error);
  });

  socket.on('connected', data => {
    socket.off('connected');
    // remove all items from container
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    // call gen second view
    genSecondView(data.user, data.rooms);
  });
};
