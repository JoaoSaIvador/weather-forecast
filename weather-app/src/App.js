import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';
import { WeatherProvider } from './GlobalState';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <WeatherProvider>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </WeatherProvider>
  );
}

export default App;
