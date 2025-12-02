# Conway's Game of Life - React Implementation

## 1. Introduction
The **Game of Life**, devised by mathematician John Horton Conway in 1970, is a "zero-player game". This means its evolution is determined by its initial state, requiring no further input. It simulates a cellular automaton—a grid of cells that can be either **alive** or **dead**.

### The Rules
For each generation (frame), every cell interacts with its 8 neighbors (horizontal, vertical, and diagonal):
1.  **Underpopulation**: Any live cell with fewer than 2 live neighbors dies.
2.  **Survival**: Any live cell with 2 or 3 live neighbors lives on to the next generation.
3.  **Overpopulation**: Any live cell with more than 3 live neighbors dies.
4.  **Reproduction**: Any dead cell with exactly 3 live neighbors becomes a live cell.

These simple rules create complex, beautiful, and unpredictable patterns!

---

## 2. Project Architecture

This project uses a **Separation of Concerns** design pattern to keep the code clean, maintainable, and fast.

### Core Logic (`src/core/Grid.ts`)
*   **Role**: The "Brain". Handles pure mathematics and data.

### Rendering (`src/core/GameCanvas.tsx`)
*   **Role**: The "Painter". Visualizes the data.

Tip: Caching the next state of the grid in a ref allows us to skip re-rendering the canvas when the grid hasn't changed.

---

## 3. My Learning

Building this project taught several advanced concepts in modern web development:

*   **Optimization**: Using 1D Arrays (`y * width + x`) to represent 2D grids is faster than arrays-of-arrays.

### React
*   **`useRef` vs `useState`**:  `useState` triggers re-renders , while `useRef` keeps values silently (good for high-speed game loops).

*   **`useEffect`**: Managing the lifecycle of the game loop (starting/stopping) and cleaning up resources (`cancelAnimationFrame`).

*   **Canvas API**: How to draw pixels directly to the screen for maximum performance.

*   **Game Loop**: Implementing a custom loop using `requestAnimationFrame` instead of `setInterval` for smoother animations.

