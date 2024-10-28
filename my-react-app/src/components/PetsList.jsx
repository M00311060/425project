// src/components/PetsList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PetsList = () => {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/pets')
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
                        {pet.species} - {pet.breed}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PetsList;
