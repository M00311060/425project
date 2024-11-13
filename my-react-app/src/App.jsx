import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PetsList from './components/PetsList';
import LoginPage from './pages/login';
import Register from './pages/register';
import HomePage from './pages/HomePage';
import PetProfilesPage from './pages/PetProfilesPage';
import PetSchedulePage from './pages/PetSchedulePage';
import DashboardPage from './pages/DashboardPage';

function App() {
    return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/petProfile" element={<PetProfilesPage />} />
        <Route path="/petSchedule" element={<PetSchedulePage />} />
        <Route path="/dash" element={<DashboardPage />} />
        <Route path="/petList" element={<PetsList />} />
      </Routes>
    </Router>
    );
}

export default App;

