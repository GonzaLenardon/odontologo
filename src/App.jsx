import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import './config';
import Login from './pages/Login';
import Home from './pages/Home';
import { BASENAME } from './constants';

function App() {
  return (
    <div className="App">
      <BrowserRouter basename={BASENAME}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/pacientes" element={<Home />} />
          <Route path="/agenda" element={<Home />} />
          <Route path="/odontograma" element={<Home />} />
          <Route path="/recordatorios" element={<Home />} />
          <Route path="/obras-sociales" element={<Home />} />
          <Route path="/odontologos" element={<Home />} />
          <Route path="/proveedores" element={<Home />} />
          <Route path="/presupuestos" element={<Home />} />
          <Route path="/portal" element={<Home />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
