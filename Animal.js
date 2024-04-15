class Animat {
    constructor(hue, energy) {
        this.hue = hue;
        this.energy = energy;
        this.energyThreshold = 20; // Energy needed to reproduce

    }

    update(grid, x, y) {
        // Check if the current cell is not null before proceeding with update logic
        if (!grid[x][y]) return;

        // Movement and eating
        let moved = false;
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        directions.sort(() => Math.random() - 0.5);

        for (let [dx, dy] of directions) {
            const nx = (x + dx + grid.length) % grid.length;
            const ny = (y + dy + grid[0].length) % grid[0].length;
            if (grid[nx][ny] instanceof Plant) {
                const plant = grid[nx][ny];
                const hueDifference = Math.abs(this.hue - plant.hue);
                if (hueDifference < 15) {
                    this.energy += 5;
                    grid[nx][ny] = null;
                    moved = true;
                    break;
                }
            }
        }


        if (!moved) {
            const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
            const nx = (x + dx + grid.length) % grid.length;
            const ny = (y + dy + grid[0].length) % grid[0].length;

            if (!grid[nx][ny]) {
                grid[nx][ny] = grid[x][y].filter(a => a !== this);
                grid[x][y] = null;
            }
        }

        // Reproduction logic
        if (this.energy >= this.energyThreshold) {
            const hueMutation = Math.random() * 10 - 5;
            grid[x][y] = grid[x][y] || [];
            grid[x][y].push(new Animat((this.hue + hueMutation) % 360, this.energy / 2));
            this.energy /= 2;
        }


        if (Math.random() < 0.01 || this.energy <= 0) {

            if (Array.isArray(grid[x][y])) {
                grid[x][y] = grid[x][y].filter(a => a !== this);
            }

            if (grid[x][y] && grid[x][y].length === 0) {
                grid[x][y] = null;
            }
        }
    }

    draw(ctx, x, y, size) {
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(x * size + size / 2, y * size + size / 2, size / 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}
window.Animat = Animat;