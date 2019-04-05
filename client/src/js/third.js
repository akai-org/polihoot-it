import { container, socket } from './index';

export const genThirdView = (user, room) => {
  const h1 = document.createElement('h1');
  h1.innerHTML = `${room.name}`;
  container.appendChild(h1);

  const description = document.createElement('div');
  description.setAttribute('id', 'description');
  container.appendChild(description);
  description.innerHTML = `nick: ${user.nick}</br>id: ${user.id}</br>room: ${user.room}</br>score: ${user.score}</br></br></br>roomName: ${room.name}</br></br></br></br>`
}