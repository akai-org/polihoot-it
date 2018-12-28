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
  input.classList.add("inputNotError");
  input.classList.add("narrowInput");
  text.appendChild(input);

  const br = document.createElement('br');
  text.appendChild(br);
  
  const error = document.createElement('div');
  error.classList.add("style");
  error.classList.add("error");
  error.setAttribute('id', 'error');
  text.appendChild(error);

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

  button.addEventListener('click', () => {
    socket.emit('enter-nick', { user: input.value });
  });

  socket.on('nickError', errorType => {
    var inputs = document.getElementsByTagName('input');
    inputs[0].value='';
    inputs[0].classList.add("inputError");
    document.getElementById('error').innerHTML = '';
    if (errorType === 'double')
      document.getElementById('error').innerHTML = 'that nick is taken';
    else
      document.getElementById('error').innerHTML = 'only letters and numbers are allowed';
  });

  socket.on('connected', data => {
    socket.off('connected');
    
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    genSecondView(data.user, data.rooms);
  });
};
