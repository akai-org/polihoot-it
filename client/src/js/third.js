import { container, socket } from './index';
import { genSecondView } from './second';

export const genThirdView = (user, room, rooms) => {

  const nav = document.createElement('nav');
    const back = document.createElement('div');
    back.setAttribute('id', 'back');
    back.innerHTML = '<';
    nav.appendChild(back);
    back.addEventListener('click', () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      genSecondView(user.nick, rooms);
    });

    const roomName = document.createElement('div');
      const h2 = document.createElement('h2');
      h2.innerHTML = `${room.name}`;
      roomName.appendChild(h2);
    nav.appendChild(roomName);

    const players = document.createElement('div');
    players.setAttribute('id', 'players');
    players.innerHTML = 'PLAYERS';
      const a = document.createElement('a');
      a.innerHTML = `${room.usersCount}`;
      players.appendChild(a);
    nav.appendChild(players);
    players.addEventListener('click', () => {
      playersList.style = 'display: block;';
    });

  container.appendChild(nav);

  const question = document.createElement('div');
  question.setAttribute('id', 'question');
  question.innerHTML = "What's the height of the Eiffel tower?";
  container.appendChild(question);

  const main = document.createElement('main');

    const answers = document.createElement('div');
    answers.setAttribute('id', 'answers');
      const A = document.createElement('div');
      A.classList.add('answer');
      A.innerHTML = 'A. 323m';
      answers.appendChild(A);
      const B = document.createElement('div');
      B.classList.add('answer');
      B.innerHTML = 'B. 326m';
      answers.appendChild(B);
      const C = document.createElement('div');
      C.classList.add('answer');
      C.innerHTML = 'C. 322m';
      answers.appendChild(C);
      const D = document.createElement('div');
      D.classList.add('answer');
      D.innerHTML = 'D. 328m';
      answers.appendChild(D);
    main.appendChild(answers);
  
  container.appendChild(main);

  const playersList = document.createElement('ul');
  playersList.setAttribute('id', 'playersList');
  const backLi = document.createElement('li');
  backLi.innerHTML = '/\\';
  playersList.appendChild(backLi);
  backLi.addEventListener('click', () => {
    playersList.style = 'display: none;';
  });
  for (const player of room.users) {
    let li = document.createElement('li');
    li.innerHTML = player.nick;
    playersList.appendChild(li);
  }
  container.appendChild(playersList);
}