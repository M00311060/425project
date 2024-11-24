import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header2 from '../components/Header2';
import Footer2 from '../components/Footer2';
import Calendar from 'react-calendar';
import './styles/Calendar.css';
import './styles/PetSchedulePage.css';

const PetSchedulePage = () => {
  const [date, setDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [activeDates, setActiveDates] = useState([]);
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [newSchedule, setNewSchedule] = useState({
    vet_visit_time: '',
    vet_visit_date: '',
  });
  const [selectedPetId, setSelectedPetId] = useState(null); // Selected pet ID
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
            schedule.vet_visit_time,
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
    const filteredSchedules = schedules.filter((schedule) => {
      return (
        schedule.vet_visit_time?.startsWith(selectedDateString)||
        schedule.vet_visit_date?.startsWith(selectedDateString)
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

  // Function to handle adding a new schedule
  const addSchedule = () => {
    if (!selectedPetId) {
      alert('Please select a pet.');
      return;
    }
  
    const scheduleData = {
      vet_visit_time: newSchedule.vet_visit_time,
      vet_visit_date: newSchedule.vet_visit_date,
    };
  
    axios
      .post(`/api/users/${userId}/pets/${selectedPetId}/schedules`, scheduleData)
      .then((response) => {
        console.log('Schedule added:', response.data);
  
        // Update schedules and activeDates states
        axios
          .get(`/api/users/${userId}/pets/schedules`)
          .then((res) => {
            const fetchedSchedules = res.data.petSchedules;
            setSchedules(fetchedSchedules); // Update schedules
  
            // Extract active dates from fetched schedules
            const allDates = Object.values(fetchedSchedules)
              .flat()
              .map((schedule) => [
                schedule.vet_visit_time?.split('T')[0],
                schedule.vet_visit_date?.split('T')[0],
              ])
              .flat();
  
            const uniqueDates = [...new Set(allDates)];
            setActiveDates(uniqueDates); // Update active dates
  
            filterSchedules(date); // Refresh the filtered schedule view
          })
          .catch((error) => {
            console.error('Error fetching schedules:', error);
          });
  
        setShowModal(false); // Close modal after adding schedule
      })
      .catch((error) => {
        console.error('Error adding schedule:', error);
      });
  };  

  const deleteSchedule = (vetVisitDate) => {
    axios
      .delete(`/api/users/${userId}/pets/schedules`, { data: { vet_visit_date: vetVisitDate } })
      .then((response) => {
        alert('Schedule deleted successfully!');
  
        // Update schedules state by filtering out the deleted schedule
        const updatedSchedules = schedules.filter(
          (schedule) => schedule.vet_visit_date !== vetVisitDate
        );
        setSchedules(updatedSchedules);
  
        // Extract new active dates after deletion
        const allDates = updatedSchedules
          .flatMap((schedule) => [
            schedule.vet_visit_time?.split('T')[0],
            schedule.vet_visit_date?.split('T')[0],
          ])
          .filter(Boolean); // Remove undefined or null values
  
        const uniqueDates = [...new Set(allDates)];
        setActiveDates(uniqueDates); // Update active dates to refresh the calendar
  
        // Clear selected schedules immediately after deletion
        setSelectedSchedules((prevSelectedSchedules) =>
          prevSelectedSchedules.filter((schedule) => schedule.vet_visit_date !== vetVisitDate)
        );
  
        // Refresh filtered schedules for the currently selected date
        filterSchedules(date);
      })
      .catch((error) => {
        alert('Failed to delete schedule. Please try again.');
        console.error('Error deleting schedule:', error.response?.data || error.message);
      });
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
          tileClassName={tileClassName} // Highlight active dates
        />
      </div>

      <div>
    {/* Selected schedules */}
    {selectedSchedules.length > 0 ? (
     <ul>
     {selectedSchedules.map((schedule, index) => (
       <li key={index}>
         <strong>Pet Name:</strong> {schedule.pet_name} <br />
         <strong>Vet Time:</strong> {schedule.vet_visit_time} <br />
         <strong>Vet Visit:</strong> {schedule.vet_visit_date} <br />
         <button className="delete-button" onClick={() => deleteSchedule(schedule.vet_visit_date)}>Delete</button>
       </li>
     ))}
    </ul>
        ) : (
          <p>No activities scheduled for this date.</p>
        )}

        <button className ="button-add" onClick={() => setShowModal(true)}>
          Add Schedule
        </button>

        {/* Modal for adding a new schedule */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add Schedule</h3>
              <select
                onChange={(e) => setSelectedPetId(e.target.value)}
                value={selectedPetId}
              >
                <option value="">Select a pet</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
              <div>
                <label>Vet Time:</label>
                <input
                  type="time"
                  onChange={(e) => setNewSchedule({ ...newSchedule, vet_visit_time: e.target.value })}
                  value={newSchedule.vet_visit_time}
                />
              </div>
              <div>
                <label>Vet Visit Date:</label>
                <input
                  type="date"
                  onChange={(e) => setNewSchedule({ ...newSchedule, vet_visit_date: e.target.value })}
                  value={newSchedule.vet_visit_date}
                />
              </div>
              <button className="button-save" onClick={addSchedule}>Save Schedule</button>
              <button className="button-cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <Footer2 />
    </div>
  );
};

export default PetSchedulePage;
