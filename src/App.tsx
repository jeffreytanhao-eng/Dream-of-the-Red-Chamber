import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StartScreen } from '@/components/StartScreen';
import { GameScreen } from '@/components/GameScreen';
import { EndingScreen } from '@/components/EndingScreen';

function App() {
  return (
    <BrowserRouter>
      <div className="w-screen h-screen overflow-hidden bg-ink">
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/game" element={<GameScreen />} />
          <Route path="/ending/:id" element={<EndingScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
