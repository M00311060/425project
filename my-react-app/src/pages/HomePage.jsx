import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/styles/HomePage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="homepage">
      <Header />

      <main className="main-content">
        <section className="intro">
          <h2>Welcome to the Multi-Pet Management Plus!</h2>
          <p>
            Our app is designed to help multi-pet owners track and manage the care needs of their pets all in one place.
            Whether you have dogs, cats, birds, cows, horses, or fish, our app makes it easy to organize feeding schedules, grooming sessions, vet visits, and more!
          </p>
          <h3>Features:</h3>
          <ul>
            <li>Secure Login for Multi-Pet Owners</li>
            <li>Create and Manage Profiles for Each Pet</li>
            <li>Track Feeding, Grooming, and Vet Schedules</li>
            <li>Store Medical Records and Pet Information</li>
            <li>Receive Notifications and Reminders</li>
            <li>Sync Schedules with Google Calendar</li>
          </ul>
          <p>
            Join us in making pet management easier and more organized. Sign up today!
          </p>
          <Link to="/register" className="get-started-button">Get Started</Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
