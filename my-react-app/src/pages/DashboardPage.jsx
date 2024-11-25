import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/DashboardPage.css';
import Header2 from '../components/Header2';
import Footer2 from '../components/Footer2';
import petsImage from '../assets/pets.jpg'; // Import the image

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
      <Header2 />

      <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
      <p className="dashboard-text">
        This page serves as the central hub for managing all your pets' needs. From here, you can view your pet's medical records, manage their schedule, and keep their profiles up to date. Select an option below to get started:
      </p>

      <div className="dashboard-image-container">
        <img src={petsImage} alt="Pets" className="dashboard-image" />
      </div>
      
      <div className="button-description">
          <button onClick={goToPetProfilePage} className="dashboard-button">
            Manage Pets
          </button>
          <p className="button-text">
            Add and edit your pet profiles. Keep all their important information like breed, age, and medical history organized in one place.
          </p>
        </div>

      <div className="button-container">
        <div className="button-description">
          <button onClick={goToPetSchedulePage} className="dashboard-button">
            Pet Schedule
          </button>
          <p className="button-text">
            Keep track of your pet's daily routines, such as feeding, grooming, and vet visits. You can set reminders and plan ahead to make sure nothing is missed!
          </p>
        </div>

        <div className="button-description">
          <button onClick={goToMedicalRecordsPage} className="dashboard-button">
            Medical Records
          </button>
          <p className="button-text">
            View and update your pet's medical records. You can track vaccinations, check-ups, and any treatments your pet has received.
          </p>
        </div>
      </div>

      <Footer2 />
    </div>
  );
};

export default DashboardPage;
