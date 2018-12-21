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
  container.appendChild(button);

  const messageBox = document.createElement('div');
  // do poprawy!
  var height = -100 + window.innerHeight - document.getElementById('text').offsetHeight;
  messageBox.style.height = height;
  messageBox.style.marginTop = document.getElementById('text').offsetHeight;
  container.appendChild(messageBox);
 
  // sending message
  button.addEventListener('click', () => {
    socket.emit('message', { message: input.value, room: nick });
  });

  // getting message
  socket.on('message', data => {
    const newMessage = document.createElement('li');
    console.log(data);
    newMessage.innerHTML = data.message;
    container.appendChild(newMessage);
  });
};
