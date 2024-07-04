(function () {
  const initialFPS = 10;
  let FPS = initialFPS;
  const SIZE = 40;
  let intervalId;
  let isPaused = false;
  let isGameOver = false;

  let board;
  let snake;
  let food;
  let foodType;
  let score = 0;
  let gameStarted = false;

  function init() {
    FPS = initialFPS;
    const existingBoard = document.getElementById("board");
    if (existingBoard) existingBoard.remove();
    const existingScore = document.getElementById("score");
    if (existingScore) existingScore.remove();
    const existingGameOver = document.getElementById("gameOver");
    if (existingGameOver) existingGameOver.remove();

    board = new Board(SIZE);
    snake = new Snake([
      [4, 4],
      [4, 5],
      [4, 6],
    ]);
    placeFood();
    intervalId = setInterval(run, 1000 / FPS);
    updateScore();
    isGameOver = false;
    score = 0;
    updateScore();
  }

  function placeFood() {
    let x, y;
    do {
      x = Math.floor(Math.random() * SIZE);
      y = Math.floor(Math.random() * SIZE);
    } while (snake.isOccupying(x, y));

    food = [x, y];
    foodType = Math.random() < 0.67 ? "black" : "red";
    document.querySelector(
      `#board tr:nth-child(${x + 1}) td:nth-child(${y + 1})`
    ).style.backgroundColor = foodType;
  }

  function updateScore() {
    document.getElementById("score").innerText = String(score).padStart(5, "0");
  }

  function increaseSpeed() {
    FPS += 1;
    clearInterval(intervalId);
    intervalId = setInterval(run, 1000 / FPS);
  }

  function gameOver() {
    clearInterval(intervalId);
    isGameOver = true;
    const gameOverElement = document.createElement("div");
    gameOverElement.setAttribute("id", "gameOver");
    gameOverElement.innerText = "Fim de Jogo!";
    gameOverElement.style.position = "absolute";
    gameOverElement.style.top = "10px";
    gameOverElement.style.right = "10px";
    gameOverElement.style.left = "600px";
    gameOverElement.style.fontSize = "1.8rem";
    gameOverElement.style.color = "black";

    document.body.appendChild(gameOverElement);
  }

  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "s" && (!gameStarted || isGameOver)) {
      gameStarted = true;
      init();
    } else if (e.key.toLowerCase() === "p" && gameStarted && !isGameOver) {
      isPaused = !isPaused;
    } else if (gameStarted && !isPaused && !isGameOver) {
      switch (e.key) {
        case "ArrowUp":
          snake.changeDirection(0);
          break;
        case "ArrowRight":
          snake.changeDirection(1);
          break;
        case "ArrowDown":
          snake.changeDirection(2);
          break;
        case "ArrowLeft":
          snake.changeDirection(3);
          break;
        default:
          break;
      }
    }
  });

  class Board {
    constructor(size) {
      this.element = document.createElement("table");
      this.element.setAttribute("id", "board");
      this.color = "#ccc";
      this.top = "10px";
      this.position = "absolute";

      const scoreElement = document.createElement("div");
      scoreElement.setAttribute("id", "score");

      scoreElement.style.fontSize = "1.5rem";

      scoreElement.innerText = "00000";
      document.body.appendChild(scoreElement);
      document.body.appendChild(this.element);
      for (let i = 0; i < size; i++) {
        const row = document.createElement("tr");
        this.element.appendChild(row);
        for (let j = 0; j < size; j++) {
          const field = document.createElement("td");
          row.appendChild(field);
        }
      }
    }
  }

  class Snake {
    constructor(body) {
      this.body = body;
      this.color = "#222";
      this.direction = 1;
      this.pendingDirection = 1;
      this.body.forEach(
        (field) =>
          (document.querySelector(
            `#board tr:nth-child(${field[0] + 1}) td:nth-child(${field[1] + 1})`
          ).style.backgroundColor = this.color)
      );
    }

    walk() {
      const head = this.body[this.body.length - 1];
      let newHead;
      switch (this.pendingDirection) {
        case 0:
          newHead = [head[0] - 1, head[1]];
          break;
        case 1:
          newHead = [head[0], head[1] + 1];
          break;
        case 2:
          newHead = [head[0] + 1, head[1]];
          break;
        case 3:
          newHead = [head[0], head[1] - 1];
          break;
        default:
          break;
      }

      if (
        newHead[0] < 0 ||
        newHead[0] >= SIZE ||
        newHead[1] < 0 ||
        newHead[1] >= SIZE ||
        this.isOccupying(newHead[0], newHead[1])
      ) {
        gameOver();
        return;
      }

      this.direction = this.pendingDirection;

      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        this.body.push(newHead);
        document.querySelector(
          `#board tr:nth-child(${newHead[0] + 1}) td:nth-child(${
            newHead[1] + 1
          })`
        ).style.backgroundColor = this.color;
        if (foodType === "black") {
          score += 1;
        } else if (foodType === "red") {
          score += 2;
        }
        placeFood();
        updateScore();
        increaseSpeed();
      } else {
        this.body.push(newHead);
        const oldTail = this.body.shift();
        document.querySelector(
          `#board tr:nth-child(${newHead[0] + 1}) td:nth-child(${
            newHead[1] + 1
          })`
        ).style.backgroundColor = this.color;
        document.querySelector(
          `#board tr:nth-child(${oldTail[0] + 1}) td:nth-child(${
            oldTail[1] + 1
          })`
        ).style.backgroundColor = board.color;
      }
    }

    changeDirection(newDirection) {
      if (
        (this.direction === 0 && newDirection === 2) ||
        (this.direction === 2 && newDirection === 0) ||
        (this.direction === 1 && newDirection === 3) ||
        (this.direction === 3 && newDirection === 1)
      ) {
        return;
      }
      this.pendingDirection = newDirection;
    }

    isOccupying(x, y) {
      return this.body.some((field) => field[0] === x && field[1] === y);
    }
  }

  function run() {
    if (gameStarted && !isPaused && !isGameOver) {
      snake.walk();
    }
  }
})();
