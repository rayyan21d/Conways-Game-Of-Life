import React, { useRef, useEffect } from 'react';
import { Grid } from './Grid';

interface GameCanvasProps {
    grid: Grid;
    cellSize: number;
    running: boolean;
    speed: number;
    onGeneration: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
    grid,
    cellSize,
    running,
    speed,
    onGeneration,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);
    const lastUpdateRef = useRef<number>(0);

    const draw = (ctx: CanvasRenderingContext2D) => {
        const width = grid.getWidth();
        const height = grid.getHeight();
        const cells = grid.getCells();

        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width * cellSize, height * cellSize);

        // Draw live cells
        ctx.fillStyle = '#00ff00';

        for (let i = 0; i < cells.length; i++) {
            if (cells[i]) {
                const x = (i % width) * cellSize;
                const y = Math.floor(i / width) * cellSize;
                // Draw slightly smaller than cell size for grid effect
                ctx.fillRect(x + 1, y + 1, cellSize - 1, cellSize - 1);
            }
        }
    };

    useEffect(() => {
        const loop = (time: number) => {
            if (running) {
                const interval = 1000 / speed;
                if (time - lastUpdateRef.current >= interval) {
                    grid.nextGeneration();
                    onGeneration();
                    lastUpdateRef.current = time;
                }
            }

            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    draw(ctx);
                }
            }

            requestRef.current = requestAnimationFrame(loop);
        };

        requestRef.current = requestAnimationFrame(loop);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [running, speed, grid, onGeneration]); // Re-bind loop if dependencies change

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const gridX = Math.floor(x / cellSize);
        const gridY = Math.floor(y / cellSize);

        grid.toggle(gridX, gridY);

        // Force a redraw immediately for better responsiveness when paused
        const ctx = canvas.getContext('2d');
        if (ctx) draw(ctx);
    };

    return (
        <canvas
            ref={canvasRef}
            width={grid.getWidth() * cellSize}
            height={grid.getHeight() * cellSize}
            onClick={handleClick}
            style={{ cursor: 'pointer', border: '1px solid #333' }}
        />
    );
};
