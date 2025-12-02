export class Grid {
    private width: number;
    private height: number;
    private cells: Uint8Array;
    private nextCells: Uint8Array;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.cells = new Uint8Array(width * height);
        this.nextCells = new Uint8Array(width * height);
    }


    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getCells(): Uint8Array {
        return this.cells;
    }

    public resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.cells = new Uint8Array(width * height);
        this.nextCells = new Uint8Array(width * height);
    }

    public clear() {
        this.cells.fill(0);
        this.nextCells.fill(0);
    }

    public randomize(density: number = 0.3) {
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i] = Math.random() < density ? 1 : 0;
        }
    }

    public toggle(x: number, y: number) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            const index = y * this.width + x;
            this.cells[index] = this.cells[index] ? 0 : 1;
        }
    }

    public nextGeneration() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const idx = y * this.width + x;
                const neighbors = this.countNeighbors(x, y);
                const isAlive = this.cells[idx] === 1;

                if (isAlive && (neighbors < 2 || neighbors > 3)) {
                    this.nextCells[idx] = 0;
                } else if (!isAlive && neighbors === 3) {
                    this.nextCells[idx] = 1;
                } else {
                    this.nextCells[idx] = this.cells[idx];
                }
            }
        }

        // Swap buffers
        const temp = this.cells;
        this.cells = this.nextCells;
        this.nextCells = temp;
    }

    public countNeighbors(x: number, y: number): number {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;

                // Wrap around (toroidal grid)
                const nx = (x + dx + this.width) % this.width;
                const ny = (y + dy + this.height) % this.height;

                if (this.cells[ny * this.width + nx] === 1) {
                    count++;
                }
            }
        }
        return count;
    }

    public getRuleExplanation(x: number, y: number): { nextState: number, reason: string } {
        const neighbors = this.countNeighbors(x, y);
        const isAlive = this.cells[y * this.width + x] === 1;

        if (isAlive) {
            if (neighbors < 2) return { nextState: 0, reason: "Underpopulation (Neighbors < 2)" };
            if (neighbors > 3) return { nextState: 0, reason: "Overpopulation (Neighbors > 3)" };
            return { nextState: 1, reason: "Survival (2 or 3 Neighbors)" };
        } else {
            if (neighbors === 3) return { nextState: 1, reason: "Reproduction (Exactly 3 Neighbors)" };
            return { nextState: 0, reason: "Stays Dead" };
        }
    }
}
