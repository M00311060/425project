import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PetsList = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/pets')
      .then(response => {
        setPets(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching pets:', error);
      });
  }, []);

  return (
    <div>
      <h1>Pets List</h1>
      <ul>
        {pets.map(pet => (
          <li key={pet.id}>
            <h2>{pet.name} ({pet.species}, {pet.breed})</h2>
            <p><strong>Owner:</strong> {pet.first_name} {pet.last_name}</p>
            <p><strong>Feeding Schedule:</strong> {pet.feeding_schedule}</p>
            <p><strong>Medical History:</strong> {pet.medical_history}</p>
            <p><strong>Care Needs:</strong> {pet.care_needs}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PetsList;
