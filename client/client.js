const gameSquares = document.querySelectorAll('.game-square');


const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events');

  // <li> element
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
};
  

const updateBoard = (boardState) => {
  gameSquares.forEach( (gamesquare, index) => {
    gamesquare.textContent = boardState[index]
  })
}

const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';

  sock.emit('message', text);
};
  

const addButtonListeners = () => {
  gameSquares.forEach((gameSquare, index) => {
    gameSquare.addEventListener('click', () => {
      if (gameSquare.textContent == '') { 
        sock.emit('turn', index);
      }
    });
  });
};
  
writeEvent('Welcome to Noughts and Crosses');

const sock = io();
sock.on('message', writeEvent);

document
  .querySelector('#chat-form')
  .addEventListener('submit', onFormSubmitted);

addButtonListeners();

sock.on('board', updateBoard)

document.querySelector('.reset-button').addEventListener('click', () => {
  sock.emit('reset');
});



