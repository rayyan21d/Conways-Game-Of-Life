import { Routes, Route } from 'react-router-dom';
import { GamePage } from './pages/GamePage';
import { Visualizer } from './pages/Visualizer';


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/learn" element={<Visualizer />} />
      </Routes>
    </div>
  );
}

export default App;
