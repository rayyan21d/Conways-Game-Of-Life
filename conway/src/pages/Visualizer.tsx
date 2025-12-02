import React, { useRef, useEffect, useState } from 'react';
import { Grid } from '../core/Grid';

const CELL_SIZE = 30; // Bigger cells for easier inspection
const GRID_WIDTH = 15;
const GRID_HEIGHT = 15;

export function Visualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [grid] = useState(() => new Grid(GRID_WIDTH, GRID_HEIGHT));
    const [hoveredCell, setHoveredCell] = useState<{ x: number, y: number } | null>(null);
    const [ruleInfo, setRuleInfo] = useState<{ nextState: number, reason: string } | null>(null);

    // Initialize with a random pattern
    useEffect(() => {
        grid.randomize(0.3);
        draw();
    }, []);

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, GRID_WIDTH * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);

        // Draw Grid Lines
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        for (let x = 0; x <= GRID_WIDTH; x++) {
            ctx.beginPath();
            ctx.moveTo(x * CELL_SIZE, 0);
            ctx.lineTo(x * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);
            ctx.stroke();
        }
        for (let y = 0; y <= GRID_HEIGHT; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * CELL_SIZE);
            ctx.lineTo(GRID_WIDTH * CELL_SIZE, y * CELL_SIZE);
            ctx.stroke();
        }

        // Draw Cells
        const cells = grid.getCells();
        for (let i = 0; i < cells.length; i++) {
            if (cells[i]) {
                const x = i % GRID_WIDTH;
                const y = Math.floor(i / GRID_WIDTH);

                ctx.fillStyle = '#00ff00';
                ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
            }
        }

        // Highlight Hovered Cell and Neighbors
        if (hoveredCell) {
            const { x, y } = hoveredCell;

            // Highlight Neighbors (Yellow)
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = (x + dx + GRID_WIDTH) % GRID_WIDTH;
                    const ny = (y + dy + GRID_HEIGHT) % GRID_HEIGHT;
                    ctx.fillRect(nx * CELL_SIZE + 1, ny * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
                }
            }

            // Highlight Target (Blue)
            ctx.fillStyle = 'rgba(0, 100, 255, 0.5)';
            ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);

            // Outline Target
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    };

    // Redraw when hover changes
    useEffect(() => {
        draw();
    }, [hoveredCell]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

        if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
            setHoveredCell({ x, y });
            setRuleInfo(grid.getRuleExplanation(x, y));
        } else {
            setHoveredCell(null);
            setRuleInfo(null);
        }
    };

    const handleMouseLeave = () => {
        setHoveredCell(null);
        setRuleInfo(null);
    };

    const handleClick = () => {
        if (hoveredCell) {
            grid.toggle(hoveredCell.x, hoveredCell.y);
            setRuleInfo(grid.getRuleExplanation(hoveredCell.x, hoveredCell.y));
            draw();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', color: 'white' }}>
            <h2>Interactive Algorithm Visualizer</h2>
            <p style={{ marginBottom: '20px' }}>Hover over a cell to see how the algorithm decides its fate.</p>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                <canvas
                    ref={canvasRef}
                    width={GRID_WIDTH * CELL_SIZE}
                    height={GRID_HEIGHT * CELL_SIZE}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                    style={{ cursor: 'crosshair', border: '2px solid #555' }}
                />

                <div style={{
                    width: '300px',
                    padding: '20px',
                    background: '#222',
                    borderRadius: '8px',
                    border: '1px solid #444'
                }}>
                    <h3>Cell Inspector</h3>
                    {hoveredCell ? (
                        <div>
                            <p><strong>Position:</strong> ({hoveredCell.x}, {hoveredCell.y})</p>
                            <p><strong>Current State:</strong> <span style={{ color: grid.getCells()[hoveredCell.y * GRID_WIDTH + hoveredCell.x] ? '#0f0' : '#888' }}>
                                {grid.getCells()[hoveredCell.y * GRID_WIDTH + hoveredCell.x] ? 'ALIVE' : 'DEAD'}
                            </span></p>
                            <p><strong>Neighbors:</strong> {grid.countNeighbors(hoveredCell.x, hoveredCell.y)}</p>
                            <hr style={{ borderColor: '#444', margin: '15px 0' }} />
                            <p><strong>Next Generation:</strong></p>
                            <div style={{
                                padding: '10px',
                                background: ruleInfo?.nextState ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                                borderLeft: `4px solid ${ruleInfo?.nextState ? '#0f0' : '#f00'}`
                            }}>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>
                                    {ruleInfo?.nextState ? 'WILL LIVE' : 'WILL DIE'}
                                </p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#ccc' }}>
                                    Reason: {ruleInfo?.reason}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: '#888', fontStyle: 'italic' }}>Hover over the grid to inspect a cell.</p>
                    )}

                    <div style={{ marginTop: '20px' }}>
                        <h4>Legend</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                            <div style={{ width: 15, height: 15, background: '#00ff00' }}></div> Live Cell
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                            <div style={{ width: 15, height: 15, background: 'rgba(0, 100, 255, 0.5)', border: '1px solid #00ffff' }}></div> Target
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: 15, height: 15, background: 'rgba(255, 255, 0, 0.3)' }}></div> Neighbor
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
