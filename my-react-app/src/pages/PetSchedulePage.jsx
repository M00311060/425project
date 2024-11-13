import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer2 from '../components/Footer2';

const PetSchedulePage = ({ userId: propUserId }) => {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [schedules, setSchedules] = useState([]);

  // Retrieve user ID from local storage if not provided as prop
  const userId = propUserId || JSON.parse(localStorage.getItem('user')).id;

  // Fetch pets for the user
  useEffect(() => {
    if (userId) {
      axios.get(`/api/users/${userId}/pets`)
        .then((response) => {
          setPets(response.data.pets);
        })
        .catch((error) => {
          console.error('Error fetching pets:', error);
        });
    }
  }, [userId]);

  // Fetch schedules when a pet is selected
  useEffect(() => {
    if (selectedPetId) {
      axios.get(`/api/pets/${selectedPetId}/schedules`)
        .then((response) => {
          setSchedules(response.data.schedules);
        })
        .catch((error) => {
          console.error('Error fetching schedules:', error);
        });
    }
  }, [selectedPetId]);

  return (
    <div>
        <Header />

      <h1>Pet Care Schedule</h1>

      <h2>Select a Pet</h2>
      <select onChange={(e) => setSelectedPetId(e.target.value)}>
        <option value="">--Choose a pet--</option>
        {pets.map((pet) => (
          <option key={pet.id} value={pet.id}>{pet.name}</option>
        ))}
      </select>

      {selectedPetId && (
        <div>
          <h2>Schedules for {pets.find(pet => pet.id === parseInt(selectedPetId))?.name}</h2>
          <table>
            <thead>
              <tr>
                <th>Feeding Time</th>
                <th>Grooming Time</th>
                <th>Vet Visit</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td>{schedule.feeding_time}</td>
                  <td>{schedule.grooming_time}</td>
                  <td>{schedule.vet_visit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

        <Footer2 />
    </div>
  );
};

export default PetSchedulePage;
