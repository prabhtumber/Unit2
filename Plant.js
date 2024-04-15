class Plant {
    constructor(hue) {
        this.hue = hue;
        this.age = 0;
        this.maturityAge = 5;
    }
    static spawnPlantInRandomEmptyCell(grid) {
        let emptyCells = [];
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                if (!grid[x][y]) {
                    emptyCells.push({ x, y });
                }
            }
        }
        if (emptyCells.length > 0) {
            let randomIndex = Math.floor(Math.random() * emptyCells.length);
            let { x, y } = emptyCells[randomIndex];
            grid[x][y] = new Plant(Math.floor(Math.random() * 360));
        }
    }

    isMature() {
        return this.age > this.maturityAge;
    }

    getMutation() {
        // Slight hue mutation
        return Math.random() * 10 - 5;
    }

    update(grid, x, y) {
        this.age++;
        if (this.isMature()) {

            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            const emptyNeighbors = directions.filter(([dx, dy]) => {
                const nx = (x + dx + grid.length) % grid.length;
                const ny = (y + dy + grid[0].length) % grid[0].length;
                return !grid[nx][ny];
            });

            if (emptyNeighbors.length > 0) {

                const [dx, dy] = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
                const nx = (x + dx + grid.length) % grid.length;
                const ny = (y + dy + grid[0].length) % grid[0].length;


                const newHue = (this.hue + this.getMutation()) % 360;
                grid[nx][ny] = new Plant(newHue);
            }
        }

        // Chance of dying
        if (Math.random() < 0.01) {
            grid[x][y] = null;
        }
    }

    draw(ctx, x, y, size) {
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.fillRect(x * size, y * size, size, size);
    }
}
window.Plant = Plant;
