import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PetsList from './components/PetsList';
import LoginPage from './pages/login';
import Register from './pages/register';

function App() {
    return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/petList" element={<PetsList />} />
      </Routes>
    </Router>
    );
}

export default App;

