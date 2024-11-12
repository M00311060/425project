import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './styles/PetProfilesPage.css';

const PetProfilesPage = () => {
  // Assuming we have a userId from login context or session
  const userId = 1; // Example user ID, replace with actual login info or context

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
      const newPet = { ...form, user_id: userId }; // Add user_id here

      try {
        // Make a POST request to the backend API to save the pet data
        const response = await fetch('/api/pets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPet),
        });

        if (response.ok) {
          // If successful, get the returned data (such as the ID) and update state
          const savedPet = await response.json();
          setPets([...pets, savedPet]);

          // Clear the form fields after adding the pet
          setForm({
            name: '',
            species: '',
            breed: '',
            feeding_schedule: '',
            medical_history: '',
            care_needs: '',
          });
        } else {
          throw new Error('Failed to add pet');
        }
      } catch (error) {
        console.error(error);
        alert('There was an error adding the pet');
      }
    }
  };

  return (
    <div className="pet-profiles-page">
      <Header />
      <main className="main-content">
        <h2>Manage Your Pets</h2>
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

        <section className="pet-list">
          <h3>Your Pets</h3>
          {pets.length > 0 ? (
            <ul>
              {pets.map((pet, index) => (
                <li key={index} className="pet-card">
                  <h4>{pet.name}</h4>
                  <p>Species: {pet.species}</p>
                  <p>Breed: {pet.breed}</p>
                  <p>Feeding Schedule: {pet.feeding_schedule}</p>
                  <p>Medical History: {pet.medical_history}</p>
                  <p>Care Needs: {pet.care_needs}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pets added yet.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PetProfilesPage;
