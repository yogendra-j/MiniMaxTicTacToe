import { backgroundAnimation, levelUp } from "./animation.js";

let canvas,
  buttons,
  menu,
  c,
  gameBoard,
  lastMove,
  colorX,
  colorY,
  boardDimension,
  cellDimension,
  toss,
  startBoardX,
  startBoardY,
  gameRunning;

const init = () => {
  //select menu and buttons
  menu = document.querySelector("#menu");
  buttons = document.querySelectorAll("button");
  //select canvas
  canvas = document.querySelector("canvas");
  //set full height and width
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  //event listener for click
  buttons.forEach((btn) => btn.addEventListener("click", whoIsFirst));
  //get context
  c = canvas.getContext("2d");

  //move colors
  colorX = "rgb(222,122,11)";
  colorY = "rgb(51,141,221)";

  //square board
  boardDimension = Math.min(Math.floor((canvas.width * 0.8) / 3) * 3, 600);
  cellDimension = boardDimension / 3;
  startBoardY = (canvas.height - boardDimension) / 2 + 30;
  startBoardX = (canvas.width - boardDimension) / 2;
  drawTTTBoard();
  backgroundAnimation();
};

//Ask who'll go first
function whoIsFirst() {
  lastMove = this.id === "ai" ? "X" : "O";
  menu.classList.add("hidden");
  canvas.classList.remove("hidden");
  //start game
  setTimeout(startGame, 200);
}
const startGame = () => {
  gameRunning = true;
  window.addEventListener("click", playerMove);
  //GameBoard
  gameBoard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  reDrawBoard();
  if (lastMove === "X") aiMove(); //call ai if first move is of ai
};
//change size on window size change
window.addEventListener("resize", reDrawBoard);
function reDrawBoard() {
  if (gameBoard === undefined) return;
  init();
  gameBoard.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell !== 0) drawMove(r, c);
    })
  );
}
//draw tic tac toe
const drawTTTBoard = () => {
  //clear canvas
  c.clearRect(0, 0, canvas.width, canvas.height);
  //draw 4 lines
  //left vertical lline
  drawLine(
    [(canvas.width - cellDimension) / 2, startBoardY],
    [(canvas.width - cellDimension) / 2, boardDimension + startBoardY]
  );
  //right vertical line
  drawLine(
    [(canvas.width + cellDimension) / 2, startBoardY],
    [(canvas.width + cellDimension) / 2, boardDimension + startBoardY]
  );
  //top horizontal line
  drawLine(
    [startBoardX, startBoardY + cellDimension],
    [startBoardX + boardDimension, startBoardY + cellDimension]
  );
  //bottom horizontal line
  drawLine(
    [startBoardX, startBoardY + 2 * cellDimension],
    [startBoardX + boardDimension, startBoardY + 2 * cellDimension]
  );
};
//draw line b/w two points
function drawLine(start, finish, color = "rgb(84,172,94") {
  c.beginPath();
  c.strokeStyle = color;
  c.moveTo(...start);
  c.lineTo(...finish);
  c.stroke();
}
//player move
function playerMove(e) {
  //allow to move only on turn
  if (lastMove === "O" && gameRunning) {
    let [row, col] = getClickedCell(e);
    //check if this position is valid and the cell is empty
    if (0 <= row < 3 && 0 <= col < 3 && gameBoard[row][col] === 0) {
      drawMove(row, col);
      //check game over
      let winningCells = isGameOver();
      if (typeof winningCells === "object") gameover(winningCells);
    }
    //call ai to move
    setTimeout(aiMove, 300);
  }
}
//get row/col of click cell
function getClickedCell(e) {
  const posX = e.clientX;
  const posY = e.clientY;
  const col = Math.floor((posX - startBoardX) / cellDimension);
  const row = Math.floor((posY - startBoardY) / cellDimension);
  return [row, col];
}
//draw move on screen
const drawMove = (row, col) => {
  //simulate next turn
  moveTurn();
  //O or X in game board
  gameBoard[row][col] = lastMove === "O" ? 1 : -1;
  //get cell cordinates
  let { cellX, cellY } = getCodinates(row, col);
  //modify cordinates to make them suitable for text draw
  cellX += 0.2 * cellDimension;
  cellY += 0.8 * cellDimension;
  //draw text
  c.fillStyle = lastMove === "O" ? colorX : colorY;
  c.font = `${cellDimension * 0.8}px Verdana`;
  c.fillText(lastMove, cellX, cellY);
};
//return O or X depending on the turn
const moveTurn = () => {
  lastMove = lastMove === "O" ? "X" : "O";
};
//win ?
const isGameOver = () => {
  let winningCells;
  //have to check 3 rows, 3 cols and 2 diagonals
  for (let row = 0; row < 3; row++) {
    let sum = 0;
    winningCells = [];
    for (let col = 0; col < 3; col++) {
      sum += gameBoard[row][col];
      winningCells.push([row, col]);
    }
    if (Math.abs(sum) === 3) {
      // gameover(winningCels);
      return winningCells;
    }
  }
  //col check
  for (let col = 0; col < 3; col++) {
    let sum = 0;
    winningCells = [];
    for (let row = 0; row < 3; row++) {
      sum += gameBoard[row][col];
      winningCells.push([row, col]);
    }
    if (Math.abs(sum) === 3) {
      // gameover(winningCels);
      return winningCells;
    }
  }
  //diag check
  let sum1 = 0;
  let sum2 = 0;
  for (let row = 0; row < 3; row++) {
    sum1 += gameBoard[row][row]; //main diag
    sum2 += gameBoard[row][2 - row]; //anti diag
  }
  if (Math.abs(sum1) === 3 || Math.abs(sum2) === 3) {
    return Math.abs(sum1) > Math.abs(sum2)
      ? [
          [0, 0],
          [1, 1],
          [2, 2],
        ]
      : [
          [0, 2],
          [1, 1],
          [2, 0],
        ];
  }

  if (
    gameBoard.reduce(
      (a, arr) => a + arr.reduce((a, c) => a + Number(c === 0), 0),
      0
    ) === 0
  )
    return [];
  return false;
};
const gameover = (winningCells) => {
  //draw condition
  if (winningCells.length === 0) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        winningCells.push([i, j]);
      }
    }
  }
  c.fillStyle = "rgba(111,2,0,0.5)";
  winningCells.forEach(([row, col]) => {
    let { cellX, cellY } = getCodinates(row, col);
    c.fillRect(cellX, cellY, cellDimension - 2, cellDimension - 2); //to make it look better
  });

  //check result and update
  let result =
    winningCells.length === 9 ? "Draw!Try Again?" : "Sorry! Try Again?";
  document.getElementById("msg").textContent = result;
  setTimeout(() => menu.classList.remove("hidden"), 300);
  gameRunning = false;
  levelUp();
};

function getCodinates(row, col) {
  const cellX = startBoardX + col * cellDimension;
  const cellY = startBoardY + row * cellDimension;
  return { cellX, cellY };
}

//MiniMax algo
//depth to offset the moves
const miniMax = (depth = 0) => {
  const curDepth = depth + 1;
  const result = isGameOver();

  if (result !== false) {
    if (result.length === 0) {
      return [0 - curDepth, 0, 0]; //draw
    }
    if (gameBoard[result[0][0]][result[0][1]] === 1) {
      // 1 means ai won
      return [10 - curDepth, 0, 0];
    }
    return [-10 - curDepth, 0, 0];
  }
  //if last move was of human, this move is of ai, choose max score else choose min score
  let bestScore = lastMove === "O" ? 999 : -999;
  let bestMove;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (gameBoard[row][col] === 0) {
        moveTurn();
        gameBoard[row][col] = lastMove === "O" ? 1 : -1;
        let moveResult = miniMax(curDepth)[0];
        //this move ai
        if (lastMove === "O") {
          if (bestScore < moveResult) {
            bestScore = moveResult;
            bestMove = [row, col];
          }
        } else {
          if (bestScore > moveResult) {
            bestScore = moveResult;
            bestMove = [row, col];
          }
        }
        moveTurn();
        gameBoard[row][col] = 0;
      }
    }
  }
  return [bestScore, ...bestMove];
};

const aiMove = () => {
  let [_, row, col] = miniMax();
  drawMove(row, col);
  //check game over
  let winningCells = isGameOver();
  if (typeof winningCells === "object") gameover(winningCells);
};
init();
