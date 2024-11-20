import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header2 from '../components/Header2';
import Footer2 from '../components/Footer2';
import Calendar from 'react-calendar';
import './styles/Calendar.css';

const PetSchedulePage = () => {
  const [date, setDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]); // Full schedules data from API
  const [selectedSchedules, setSelectedSchedules] = useState([]); // Filtered schedules based on selected date
  const [activeDates, setActiveDates] = useState([]); // Dates with scheduled activities
  const [pets, setPets] = useState([]); // Pets data
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  // Fetch pets and pet schedules from the backend
  useEffect(() => {
    // Fetch pets associated with the user
    axios
      .get(`/api/users/${userId}/pets`)
      .then((response) => {
        setPets(response.data.pets); // Store pet data
      })
      .catch((error) => {
        console.error('Error fetching pets:', error);
      });

    // Fetch pet schedules from the backend
    axios
      .get(`/api/users/${userId}/pets/schedules`)
      .then((response) => {
        const fetchedSchedules = response.data.petSchedules;
        setSchedules(fetchedSchedules); // Store the full schedule data

        // Extract all the dates with scheduled activities (feeding, grooming, vet visits)
        const allDates = Object.values(fetchedSchedules)
          .flat()
          .map((schedule) => [
            schedule.feeding_date,
            schedule.grooming_date,
            schedule.vet_visit_date,
          ])
          .flat();

        // Create an array of unique dates with scheduled activities
        const uniqueDates = [...new Set(allDates)];
        setActiveDates(uniqueDates);
      })
      .catch((error) => {
        console.error('Error fetching pet schedules:', error);
      });
  }, [userId]);

  // Handle date selection in the calendar
  const onDateChange = (selectedDate) => {
    setDate(selectedDate);
    filterSchedules(selectedDate);
  };

  // Filter schedules based on the selected date
  const filterSchedules = (selectedDate) => {
    const selectedDateString = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    // Filter schedules for feeding, grooming, or vet visits matching the selected date
    const filteredSchedules = Object.values(schedules).flat().filter((schedule) => {
      return (
        schedule.feeding_date === selectedDateString ||
        schedule.grooming_date === selectedDateString ||
        schedule.vet_visit_date === selectedDateString
      );
    });

    setSelectedSchedules(filteredSchedules);
  };

  // Add custom CSS class for active dates in the calendar
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      if (activeDates.includes(dateString)) {
        return 'highlighted'; // Apply the "highlighted" class to active dates
      }
    }
    return '';
  };

  // Function to get the pet name by petId
  const getPetNameById = (petId) => {
    const pet = pets.find(pet => pet.id === petId);
    return pet ? pet.name : 'Unknown Pet';
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Header2 />
      <h1>Pet Care Schedule</h1>
      <p>Select a date to view or schedule pet care activities.</p>
      <div style={{ display: 'inline-block', marginTop: '20px' }}>
        <Calendar
          onChange={onDateChange}
          value={date}
          tileClassName={tileClassName} // Use the tileClassName to highlight dates
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2>Selected Date: {date.toDateString()}</h2>
        {selectedSchedules.length > 0 ? (
          <ul>
            {selectedSchedules.map((schedule, index) => (
              <li key={index}>
                <strong>Pet Name:</strong> {getPetNameById(schedule.pet_id)} <br />
                <strong>Feeding Time:</strong> {schedule.feeding_time} <br />
                <strong>Grooming Time:</strong> {schedule.grooming_time} <br />
                <strong>Vet Visit:</strong> {schedule.vet_visit_date}
              </li>
            ))}
          </ul>
        ) : (
          <p>No activities scheduled for this date.</p>
        )}
      </div>
      <Footer2 />
    </div>
  );
};

export default PetSchedulePage;
