
class Automata {
    constructor(gameEngine, width, height) {
        this.gameEngine = gameEngine;
        this.width = width;
        this.height = height;
        this.cellSize = 7;
        this.grid = this.initializeGrid();
        this.tickCount = 0;

    }

    initializeGrid() {
        let rows = Math.floor(this.height / this.cellSize);
        let cols = Math.floor(this.width / this.cellSize);
        let grid = new Array(cols);
        for (let i = 0; i < cols; i++) {
            grid[i] = new Array(rows).fill(null);
        }


        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (Math.random() < 0.1) {
                    grid[i][j] = new Plant(Math.floor(Math.random() * 360));
                } else if (Math.random() < 0.02) {
                    grid[i][j] = [new Animat(Math.floor(Math.random() * 360), 10)];
                }
            }
        }
        return grid;
    }


    update() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                let cell = this.grid[i][j];
                if (cell instanceof Plant) {
                    cell.update(this.grid, i, j);
                } else if (Array.isArray(cell)) {

                    cell.forEach(animat => {
                        if (animat) {
                            animat.update(this.grid, i, j);
                        }
                    });

                    if (this.grid[i][j]) {
                        this.grid[i][j] = this.grid[i][j].filter(a => a && a.energy > 0);
                    }
                }

                if (cell instanceof Plant && Math.random() < 0.001) {
                    this.grid[i][j] = null;
                }
            }
        }

        if (this.tickCount % 100 === 0) {
            Plant.spawnPlantInRandomEmptyCell(this.grid);
        }
        this.tickCount++;
    }




    countNeighbors(x, y) {
        let sum = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let col = (x + i + this.grid.length) % this.grid.length;
                let row = (y + j + this.grid[x].length) % this.grid[x].length;
                sum += this.grid[col][row];
            }
        }
        sum -= this.grid[x][y];
        return sum;
    }

    draw(ctx) {
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                let cell = this.grid[x][y];
                if (cell instanceof Plant) {
                    ctx.fillStyle = `hsl(${cell.hue}, 100%, 50%)`;  // Color based on the plant's hue
                } else if (Array.isArray(cell) && cell.length > 0) {
                    ctx.fillStyle = `hsl(${cell[0].hue}, 100%, 50%)`;  // Assume the first animat's color
                } else {
                    ctx.fillStyle = "white";
                }
                ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }
    addPlant(x, y, hue) {
        if (this.grid[x] && this.grid[x][y] === null) {
            this.grid[x][y] = new Plant(hue);
        }
    }

    addAnimat(x, y, hue, energy) {
        if (this.grid[x] && this.grid[x][y] === null) {
            this.grid[x][y] = [new Animat(hue, energy)];
        }
    }



}
window.Automata = Automata;