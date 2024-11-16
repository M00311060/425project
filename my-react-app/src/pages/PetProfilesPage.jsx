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
    care_needs: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editPetId, setEditPetId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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

  const handleAddOrUpdatePet = async (e) => {
    e.preventDefault();

    if (!form.name || !form.species || !form.breed || !form.feeding_schedule || !form.medical_history || !form.care_needs) {
      setErrorMessage('All fields are required');
      return;
    }

    const petData = { ...form, user_id: userId };

    try {
      if (isEditing) {
        // Update pet
        const response = await fetch(`/api/pets/${editPetId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(petData),
        });

        if (response.ok) {
          setSuccessMessage('Pet updated successfully!');
        } else {
          throw new Error('Failed to update pet');
        }
      } else {
        // Add new pet
        const response = await fetch('/api/pets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(petData),
        });

        if (response.ok) {
          setSuccessMessage('Your pet has been added!');
        } else {
          throw new Error('Failed to add pet');
        }
      }

      // Reset form and state
      setForm({
        name: '',
        species: '',
        breed: '',
        feeding_schedule: '',
        medical_history: '',
        care_needs: '',
      });
      setEditPetId(null);
      setIsEditing(false);
      handleFetchPets();
    } catch (error) {
      setErrorMessage('There was an error processing your request');
      console.error(error);
    }
  };

  const handleEditPet = (pet) => {
    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      feeding_schedule: pet.feeding_schedule,
      medical_history: pet.medical_history,
      care_needs: pet.care_needs,
    });
    setEditPetId(pet.id);
    setIsEditing(true);
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
                <button className="edit-pet-button" onClick={() => handleEditPet(pet)}>
                  Edit Pet
                </button>
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

        <form className="add-pet-form" onSubmit={handleAddOrUpdatePet}>
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
          <button type="submit">{isEditing ? 'Update Pet' : 'Add Pet'}</button>
        </form>
      </main>

      <Footer2 />
    </div>
  );
};

export default PetProfilesPage;
