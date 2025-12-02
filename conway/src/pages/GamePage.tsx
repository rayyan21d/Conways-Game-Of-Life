import { useState, useRef, useEffect, useCallback } from 'react';
import { Grid } from '../core/Grid';
import { GameCanvas } from '../core/GameCanvas';
import { Controls } from '../core/Controls';

const CELL_SIZE = 10;
const GRID_WIDTH = 100;
const GRID_HEIGHT = 50;

export function GamePage() {
    // ref keeps the grid instance stable across re-renders
    const gridRef = useRef<Grid>(new Grid(GRID_WIDTH, GRID_HEIGHT));

    const [running, setRunning] = useState(false);
    const [speed, setSpeed] = useState(30);
    const [generation, setGeneration] = useState(0);

    // Initialize grid with random pattern on mount
    useEffect(() => {
        gridRef.current.randomize();
    }, []);

    const handleStart = () => setRunning(true);
    const handleStop = () => setRunning(false);

    const handleClear = () => {
        gridRef.current.clear();
        setGeneration(0);
    };

    const handleRandomize = () => {
        gridRef.current.randomize();
        setGeneration(0);
    };

    const handleGeneration = useCallback(() => {
        setGeneration(g => g + 1);
    }, []);

    return (
        <div className="app-container">
            <h1>Conway's Game of Life</h1>
            <div className="game-wrapper">
                <GameCanvas
                    grid={gridRef.current}
                    cellSize={CELL_SIZE}
                    running={running}
                    speed={speed}
                    onGeneration={handleGeneration}
                />
            </div>
            <Controls
                running={running}
                onStart={handleStart}
                onStop={handleStop}
                onClear={handleClear}
                onRandomize={handleRandomize}
                speed={speed}
                onSpeedChange={setSpeed}
                generation={generation}
            />
        </div>
    );
}
