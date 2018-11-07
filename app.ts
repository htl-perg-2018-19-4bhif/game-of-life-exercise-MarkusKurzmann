window.onload = () => {
  const cellSize = 4;
  const boardSize = 200;
  let percAlive = 3;

  // Get reference to canvas
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  canvas.width = canvas.height = boardSize * cellSize;

  const boardArea = canvas.width / cellSize * canvas.height / cellSize;

  let cells = new Array(boardSize);
  createCellArray();
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  percAlive /= 100;

  drawFirstField();
  // Call 'draw' function whenever browser renders a frame on the screen
  window.requestAnimationFrame(draw);

  //Create initial playfield
  function createCellArray() {
    for (let i = 0; i < boardSize; i++) {
      cells[i] = new Array(boardSize);
      for (let j = 0; j < boardSize; j++) {
        cells[i][j] = false;
      }
    }
  }

  //Check amount of Neighbours
  function getNeighbours(x: number, y: number): number {
    let neighbors = 0;
    for (let i = y - 1; i <= y + 1; i++) {
      for (let j = x - 1; j <= x + 1; j++) {
        if (i >= 0 && j >= 0 && j < boardSize && i < boardSize) {
          if (cells[i][j] == true) {
            neighbors++;
          }
        }
      }
    }

    return neighbors;
  }

  //Check if cell can live or has to die
  function canLive(x: number, y: number): boolean {
    const neighbors = getNeighbours(x, y);
    const alive = cells[y][x];
    if (alive && neighbors < 2) {
      return false;
    }

    if (alive && (neighbors == 2 || neighbors == 3)) {
      return true;
    }

    if (alive && neighbors > 3) {
      return false;
    }

    if (!alive && neighbors == 3) {
      return true;
    }

  }


  //drawAliveCells
  function alive() {
    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells[i].length; j++) {
        if ((cells[i][j] = canLive(j, i)) == true) {
          drawSingleCell(j * cellSize, i * cellSize);
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    alive();
    window.requestAnimationFrame(draw);
  }

  function getRandomPosition() {
    const x = Math.floor(Math.random() * canvas.width / cellSize);
    const y = Math.floor(Math.random() * canvas.height / cellSize);

    let coords = { x: x, y: y }

    return coords;
  }

  function drawSingleCell(x: number, y: number) {
    ctx.fillRect(x, y, cellSize, cellSize);
  }

  function drawCells() {
    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells[i].length; j++) {
        if (cells[i][j]) {
          const absoluteY = i * cellSize;
          const absoluteX = j * cellSize;
          drawSingleCell(absoluteX, absoluteY);
        }
      }
    }
  }

  function drawFirstField() {
    const nrOfCells = boardArea * percAlive;

    for (let i = 0; i < nrOfCells; i++) {
      const coords = getRandomPosition();
      const relativeX = coords.x;
      const relativeY = coords.y;

      cells[relativeY][relativeX] = true;
    }

    drawCells();

  }
};