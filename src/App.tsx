import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TimerPage from './pages/TimerPage';
import StatsPage from './pages/StatsPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<TimerPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
