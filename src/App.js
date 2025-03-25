import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import './config.js';
import Navbar from './components/navbar/Navbar';
import Login from './pages/Login';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';
import Home from './pages/Home';
import HomeNew from './pages/HomeNew.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="background">
          <p className="version">V.1.5.2</p>
        </div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
