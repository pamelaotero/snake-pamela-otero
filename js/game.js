(function () {
  let FPS = 10;
  const SIZE = 40;

  let board;
  let snake;
  let food;
  let score = 0;
  let gameStarted = false;

  function init() {
    board = new Board(SIZE);
    snake = new Snake([
      [4, 4],
      [4, 5],
      [4, 6],
    ]);
    placeFood();
    setInterval(run, 1000 / FPS);
    updateScore();
  }

  function placeFood() {
    let x, y;
    do {
      x = Math.floor(Math.random() * SIZE);
      y = Math.floor(Math.random() * SIZE);
    } while (snake.isOccupying(x, y));

    food = [x, y];
    document.querySelector(
      `#board tr:nth-child(${x + 1}) td:nth-child(${y + 1})`
    ).style.backgroundColor = "red";
  }

  function updateScore() {
    document.getElementById("score").innerText = String(score).padStart(5, "0");
  }

  window.addEventListener("keydown", (e) => {
    if (!gameStarted && e.key.toLowerCase() === "s") {
      gameStarted = true;
      init();
    } else if (gameStarted) {
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
      document.body.appendChild(this.element);
      for (let i = 0; i < size; i++) {
        const row = document.createElement("tr");
        this.element.appendChild(row);
        for (let j = 0; j < size; j++) {
          const field = document.createElement("td");
          row.appendChild(field);
        }
      }
      const scoreElement = document.createElement("div");
      scoreElement.setAttribute("id", "score");
      scoreElement.innerText = "00000";
      document.body.appendChild(scoreElement);
    }
  }

  class Snake {
    constructor(body) {
      this.body = body;
      this.color = "#222";
      this.direction = 1; // 0 para cima, 1 para direita, 2 para baixo, 3 para esquerda
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
      switch (this.direction) {
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

      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        this.body.push(newHead);
        document.querySelector(
          `#board tr:nth-child(${newHead[0] + 1}) td:nth-child(${
            newHead[1] + 1
          })`
        ).style.backgroundColor = this.color;
        placeFood();
        score++;
        updateScore();
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
    changeDirection(direction) {
      this.direction = direction;
    }
    isOccupying(x, y) {
      return this.body.some((field) => field[0] === x && field[1] === y);
    }
  }

  function run() {
    if (gameStarted) {
      snake.walk();
    }
  }
})();
