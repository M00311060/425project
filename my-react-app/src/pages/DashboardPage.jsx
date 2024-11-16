import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/DashboardPage.css';
import Header from '../components/Header';
import Footer2 from '../components/Footer2';


const DashboardPage = () => {
  const navigate = useNavigate();

  const goToPetSchedulePage = () => {
    navigate('/petSchedule');
  };

  const goToPetProfilePage = () => {
    navigate('/petProfile');
  };

  const goToMedicalRecordsPage = () => {
    navigate('/records');
  };

  return (
    <div className="dashboard-container">
        <Header />

      <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
      <p className="dashboard-text">Select an option below to get started:</p>
      <div className="button-container">
        <button onClick={goToPetSchedulePage} className="dashboard-button">
          Pet Schedule
        </button>
        <button onClick={goToPetProfilePage} className="dashboard-button">
          Create Pet
        </button>
          <button onClick={goToMedicalRecordsPage} className="dashboard-button">
          Medical Records
        </button>
      </div>

        <Footer2 />
    </div>
  );
};

export default DashboardPage;
