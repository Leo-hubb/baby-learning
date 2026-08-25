import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SpeechInit from './components/SpeechInit';
import English from './pages/English';
import Literacy from './pages/Literacy';
import Math from './pages/Math';
import Logic from './pages/Logic';
import Adventure from './pages/Adventure';
import Badges from './pages/Badges';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Layout>
      <SpeechInit />
      <Routes>
        <Route path="/" element={<Navigate to="/english" replace />} />
        <Route path="/english/*" element={<English />} />
        <Route path="/literacy/*" element={<Literacy />} />
        <Route path="/math" element={<Math />} />
        <Route path="/logic" element={<Logic />} />
        <Route path="/adventure/*" element={<Adventure />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}
