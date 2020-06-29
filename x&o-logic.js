// here we have a class with game logic

class XOsGame {
  constructor(p1, p2) {
    this.players = [p1, p2]
    this.turn = 'X'
    this.turnCounter = 0
    this.board = ['','','','','','','','','']
    this.gameOver = false

    this.players.forEach( (player, index) => {
      index === 0 ? this.sendToPlayer(index, 'You are X') : this.sendToPlayer(index, 'You are O')
    })
    
    this.players.forEach((player) => {
      player.on('turn', (changedSquare) => {
        
        if (!this.gameOver) {

          this.board = this.board.map((state, index) => {
            if (index === changedSquare ) {
              state = this.turn
            }
            return state
          })
        }

        this.onTurn(this.board)

        this.turnCounter = this.turnCounter + 1
        this.turnCounter % 2 === 0 ? this.turn = 'X' : this.turn = 'O'
        
        this.checkWinner()
      })
    })
  }

  handleEndGame = () => {
    this.turn = 'X'
    this.turnCounter = 0
    this.board = ['','','','','','','','','']
    this.gameOver = false
  }

   
  checkWinner = () => {
    // need 8 checks of each possiblity of 3 in a row
    
    // check first row
    this.checkRow(1);
    // check second row
    this.checkRow(2);
    // check third row
    this.checkRow(3);
    // check first column
    
    this.checkColumn(1);
    // check second column
    this.checkColumn(2);
    // check third column
    this.checkColumn(3);
    
    // check diagonal top left to bottom right
    this.checkDiagonalStartTopLeft();
    
    // check diagonal top right to bottom left
    this.checkDiagonalStartTopRight();

    if (this.gameOver) { this.handleEndGame() }
  } 

  checkRow = (num) => {
    if (this.board[3 * (num - 1)] !== '') {
        let checkArray = [];
        for (var index = 3 * (num - 1); index < 3 * num; index++) {
            checkArray.push(this.board[index]);
        }
        if (checkArray[0] === checkArray[1] && checkArray[1]=== checkArray[2]) {
            this.sendToPlayers(checkArray[0] + '\'s have won!');
            this.gameOver = true
        }
    }
  }

  checkColumn = (num) => {
    if (this.board[num - 1] !== '') { 
        let checkArray = [];
        for (var index = num - 1; index < 6 + num; index += 3) {
            checkArray.push(this.board[index]);
        }
        if (checkArray[0] === checkArray[1] && checkArray[1]=== checkArray[2]) {
            this.sendToPlayers(checkArray[0] + '\'s have won!');
            this.gameOver = true
        }
    }
  }

  checkDiagonalStartTopLeft = () => {
    if (this.board[0] !== '') {
        let checkArray = [];
        for (var index = 0; index < 9; index += 4) {
            checkArray.push(this.board[index]);
        }
        if (checkArray[0] === checkArray[1] && checkArray[1]=== checkArray[2]) {
            this.sendToPlayers(checkArray[0] + '\'s have won!');
            this.gameOver = true
        }
    }
  }

  checkDiagonalStartTopRight = () => {
    if (this.board[2] !== '') {
      let checkArray = [];
      for (var index = 2; index < 7; index += 2) {
          checkArray.push(this.board[index]);
      }
      if (checkArray[0] === checkArray[1] && checkArray[1]=== checkArray[2]) {
          this.sendToPlayers(checkArray[0] + '\'s have won!');
          this.gameOver = true
      }
    }
  } 

  sendToPlayer(playerIndex, msg) {
    this.players[playerIndex].emit('message', msg)
  }

  sendToPlayers(msg) {
    this.players.forEach((player) => {
        player.emit('message', msg)
    })
  }
  updateBoardstate(boardState) {
    this.players.forEach((player) => {
        player.emit('board', boardState)
    })
  }

  
  onTurn(boardState) {
    this.sendToPlayers(`It is now ${this.turn} turn`)
    this.updateBoardstate(boardState)
  }

}

module.exports = XOsGame;
