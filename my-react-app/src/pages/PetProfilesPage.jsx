import React, { useState } from 'react';
import Header2 from '../components/Header2';
import Footer2 from '../components/Footer2';
import './styles/PetProfilesPage.css';

const PetProfilesPage = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({
    name: '',
    species: '',
    breed: '',
    feeding_schedule: '',
    medical_history: '',
    care_needs: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    
    if (form.name && form.species && form.breed && form.feeding_schedule && form.medical_history && form.care_needs) {
      const newPet = { ...form, user_id: userId };

      try {
        const response = await fetch('/api/pets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPet),
        });

        if (response.ok) {
          setSuccessMessage('Your pet has been added!');
          setForm({
            name: '',
            species: '',
            breed: '',
            feeding_schedule: '',
            medical_history: '',
            care_needs: '',
          });
          handleFetchPets();
        } else {
          throw new Error('Failed to add pet');
        }
      } catch (error) {
        setErrorMessage('There was an error adding the pet');
        console.error(error);
      }
    }
  };

  const handleFetchPets = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/pets`);
      if (response.ok) {
        const data = await response.json();
        setPets(data.pets);
      } else {
        throw new Error('Failed to fetch pets');
      }
    } catch (error) {
      setErrorMessage('There was an error fetching the pets');
      console.error(error);
    }
  };

  const handleDeletePet = async (id) => {
    try {
      const response = await fetch(`/api/pets/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMessage('Pet deleted successfully');
        handleFetchPets(); // Refresh the pet list after deletion
      } else {
        throw new Error('Failed to delete pet');
      }
    } catch (error) {
      setErrorMessage('There was an error deleting the pet');
      console.error(error);
    }
  };

  return (
    <div className="pet-profiles-page">
      <Header2 />

      <main className="main-content">
        <h2>Manage Your Pets</h2>
        <button className="fetch-pets-button" onClick={handleFetchPets}>
          Show My Pets
        </button>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="pets-list-container">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <div key={pet.id} className="pet-card">
                <h3>{pet.name}</h3>
                <p>Species: {pet.species}</p>
                <p>Breed: {pet.breed}</p>
                <p>Feeding Schedule: {pet.feeding_schedule}</p>
                <p>Medical History: {pet.medical_history}</p>
                <p>Care Needs: {pet.care_needs}</p>
                <button
                  className="delete-pet-button"
                  onClick={() => handleDeletePet(pet.id)}
                >
                  Delete Pet
                </button>
              </div>
            ))
          ) : (
            <p>No pets found. Add a pet to get started!</p>
          )}
        </div>
        
        <form className="add-pet-form" onSubmit={handleAddPet}>
          <label>
            Pet Name:
            <input type="text" name="name" value={form.name} onChange={handleInputChange} required />
          </label>
          <label>
            Species:
            <input type="text" name="species" value={form.species} onChange={handleInputChange} required />
          </label>
          <label>
            Breed:
            <input type="text" name="breed" value={form.breed} onChange={handleInputChange} required />
          </label>
          <label>
            Feeding Schedule:
            <input type="text" name="feeding_schedule" value={form.feeding_schedule} onChange={handleInputChange} required />
          </label>
          <label>
            Medical History:
            <input type="text" name="medical_history" value={form.medical_history} onChange={handleInputChange} required />
          </label>
          <label>
            Care Needs:
            <input type="text" name="care_needs" value={form.care_needs} onChange={handleInputChange} required />
          </label>
          <button type="submit">Add Pet</button>
        </form>
      </main>

      <Footer2 />
    </div>
  );
};

export default PetProfilesPage;
