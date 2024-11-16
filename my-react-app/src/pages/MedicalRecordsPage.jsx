import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header2 from '../components/Header2';
import Footer2 from '../components/Footer2';
import './styles/MedicalRecordsPage.css';

const MedicalRecordsPage = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    if (userId) {
      axios
        .get(`/api/medical-records/user/${userId}`)
        .then((response) => {
          setMedicalRecords(response.data.data);
        })
        .catch((error) => {
          console.error('Error fetching medical records:', error.message);
        });
    }
  }, [userId]);

  return (
    <div>
        <Header2 />
      <h2>Medical Records</h2>
      {medicalRecords.length > 0 ? (
        <ul>
          {medicalRecords.map((record) => (
            <li key={record.record_id}>
              <strong>Pet Name:</strong> {record.pet_name} <br />
              <strong>Record:</strong> {record.record}
            </li>
          ))}
        </ul>
      ) : (
        <p>No medical records found for this user.</p>
      )}

      <Footer2 />
    </div>
  );
};

export default MedicalRecordsPage;
