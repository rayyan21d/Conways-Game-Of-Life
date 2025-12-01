import React from 'react';

interface ControlsProps {
    running: boolean;
    onStart: () => void;
    onStop: () => void;
    onClear: () => void;
    onRandomize: () => void;
    speed: number;
    onSpeedChange: (speed: number) => void;
    generation: number;
}

export const Controls: React.FC<ControlsProps> = ({
    running,
    onStart,
    onStop,
    onClear,
    onRandomize,
    speed,
    onSpeedChange,
    generation,
}) => {
    return (
        <div className="controls">
            <div className="stats">
                <span>Generation: {generation}</span>
            </div>

            <div className="buttons">
                {running ? (
                    <button onClick={onStop} className="btn stop">Stop</button>
                ) : (
                    <button onClick={onStart} className="btn start">Start</button>
                )}
                <button onClick={onClear} className="btn" disabled={running}>Clear</button>
                <button onClick={onRandomize} className="btn" disabled={running}>Randomize</button>
            </div>

            <div className="sliders">
                <label>
                    Speed: {speed} fps
                    <input
                        type="range"
                        min="1"
                        max="60"
                        value={speed}
                        onChange={(e) => onSpeedChange(Number(e.target.value))}
                    />
                </label>
            </div>
        </div>
    );
};
