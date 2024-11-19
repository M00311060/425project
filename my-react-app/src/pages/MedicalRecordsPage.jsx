import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header2 from '../components/Header2';
import Footer2 from '../components/Footer2';
import './styles/MedicalRecordsPage.css';

const MedicalRecordsPage = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editedData, setEditedData] = useState({ record: '' });
  const [newRecord, setNewRecord] = useState({ pet_name: '', record: '' });
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

  const addRecord = (e) => {
    e.preventDefault();
    const payload = { userId, pet_name: newRecord.pet_name, record: newRecord.record };

    axios
      .post('/api/medical-records', payload)
      .then((response) => {
        setMedicalRecords((prevRecords) => [
          ...prevRecords,
          { record_id: response.data.id, pet_name: newRecord.pet_name, record: newRecord.record },
        ]);
        setNewRecord({ pet_name: '', record: '' }); // Clear the form
        console.log('Record added:', response.data.id);
      })
      .catch((error) => {
        console.error('Error adding medical record:', error.response?.data?.error || error.message);
      });
  };

  const deleteRecord = (recordId) => {
    axios
      .delete(`/api/medical-records/${recordId}`)
      .then((response) => {
        setMedicalRecords((prevRecords) =>
          prevRecords.filter((record) => record.record_id !== recordId)
        );
        console.log('Record deleted:', response.data.deletedID);
      })
      .catch((error) => {
        console.error('Error deleting medical record:', error.message);
      });
  };

  const handleEditClick = (record) => {
    setEditingRecord(record.record_id);
    setEditedData({ record: record.record });
  };

  const handleEditChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (recordId) => {
    axios
      .put(`/api/medical-records/${recordId}`, { record: editedData.record, pet_id: editingRecord })
      .then((response) => {
        setMedicalRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.record_id === recordId ? { ...record, record: editedData.record } : record
          )
        );
        setEditingRecord(null);
        console.log('Record updated:', response.data.updatedID);
      })
      .catch((error) => {
        console.error('Error updating medical record:', error.message);
      });
  };

  return (
    <div>
      <Header2 />
      <h2>Medical Records</h2>

      <form onSubmit={addRecord}>
        <label>
          Pet Name:
          <input
            type="text"
            value={newRecord.pet_name}
            onChange={(e) => setNewRecord({ ...newRecord, pet_name: e.target.value })}
            required
          />
        </label>
        <label>
          Record:
          <input
            type="text"
            value={newRecord.record}
            onChange={(e) => setNewRecord({ ...newRecord, record: e.target.value })}
            required
          />
        </label>
        <button className="add-button" type="submit">Add Record</button>
      </form>

      {medicalRecords.length > 0 ? (
        <ul>
          {medicalRecords.map((record) => (
            <li key={record.record_id}>
              <strong>Pet Name:</strong> {record.pet_name} <br />
              <strong>Record:</strong>{' '}
              {editingRecord === record.record_id ? (
                <input
                  type="text"
                  name="record"
                  value={editedData.record}
                  onChange={handleEditChange}
                />
              ) : (
                record.record
              )}{' '}
              <br />
              {editingRecord === record.record_id ? (
                <button className="edit-button" onClick={() => handleEditSubmit(record.record_id)}>Save</button>
              ) : (
                <button className="edit-button" onClick={() => handleEditClick(record)}>Edit</button>
              )}
              <button className="delete-record-button" onClick={() => deleteRecord(record.record_id)}>Delete</button>
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
