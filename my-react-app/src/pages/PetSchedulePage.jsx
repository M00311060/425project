import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header2 from '../components/Header2';
import Footer2 from '../components/Footer2';
import Calendar from 'react-calendar';
import './styles/Calendar.css';
import './styles/PetSchedulePage.css';

const PetSchedulePage = () => {
  const [date, setDate] = useState(new Date());
  const [vetSchedules, setVetSchedules] = useState([]);
  const [feedingSchedules, setFeedingSchedules] = useState([]);
  const [groomingSchedules, setGroomingSchedules] = useState([]);
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

    // Fetch pet schedules for vet visits
    axios
      .get(`/api/users/${userId}/pets/schedules`)
      .then((response) => {
        const fetchedSchedules = response.data.petSchedules;
        setVetSchedules(fetchedSchedules); // Store the vet visit schedule data

        // Extract all the dates with scheduled activities
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

    // Fetch feeding schedules
    axios
      .get(`/api/users/${userId}/pets/feeding_schedule`)
      .then((response) => {
        const fetchedFeedingSchedules = response.data.petSchedules;
        setFeedingSchedules(fetchedFeedingSchedules); // Store feeding schedule data

        // Extract all feeding dates
        const feedingDates = fetchedFeedingSchedules.map((schedule) => schedule.feeding_date);
        setActiveDates((prevDates) => [...new Set([...prevDates, ...feedingDates])]);
      })
      .catch((error) => {
        console.error('Error fetching feeding schedules:', error);
      });

    // Fetch grooming schedules
    axios
      .get(`/api/users/${userId}/pets/grooming_schedule`)
      .then((response) => {
        const fetchedGroomingSchedules = response.data.petSchedules;
        setGroomingSchedules(fetchedGroomingSchedules); // Store grooming schedule data

        // Extract all grooming dates
        const groomingDates = fetchedGroomingSchedules.map((schedule) => schedule.grooming_date);
        setActiveDates((prevDates) => [...new Set([...prevDates, ...groomingDates])]);
      })
      .catch((error) => {
        console.error('Error fetching grooming schedules:', error);
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

    // Filter schedules for vet visits, feeding, or grooming matching the selected date
    const filteredVetSchedules = vetSchedules.filter((schedule) => 
      schedule.vet_visit_time?.startsWith(selectedDateString) ||
      schedule.vet_visit_date?.startsWith(selectedDateString)
    );

    const filteredFeedingSchedules = feedingSchedules.filter((schedule) =>
      schedule.feeding_date?.startsWith(selectedDateString)
    );

    const filteredGroomingSchedules = groomingSchedules.filter((schedule) =>
      schedule.grooming_date?.startsWith(selectedDateString)
    );

    setSelectedSchedules([
      ...filteredVetSchedules,
      ...filteredFeedingSchedules,
      ...filteredGroomingSchedules,
    ]);
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
            setVetSchedules(fetchedSchedules); // Update schedules
  
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
                {schedule.vet_visit_time && (
                  <>
                    <strong>Vet Time:</strong> {schedule.vet_visit_time} <br />
                    <strong>Vet Visit:</strong> {schedule.vet_visit_date} <br />
                  </>
                )}
                {schedule.feeding_time && (
                  <>
                    <strong>Feeding Time:</strong> {schedule.feeding_time} <br />
                    <strong>Feeding Date:</strong> {schedule.feeding_date} <br />
                  </>
                )}
                {schedule.grooming_time && (
                  <>
                    <strong>Grooming Time:</strong> {schedule.grooming_time} <br />
                    <strong>Grooming Date:</strong> {schedule.grooming_date} <br />
                  </>
                )}
                <button className="delete-button" onClick={() => deleteSchedule(schedule.vet_visit_date)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No activities scheduled for this date.</p>
        )}

        <button className="button-add" onClick={() => setShowModal(true)}>
          Add Schedule
        </button>

        {/* Modal for adding a new schedule */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add Schedule</h3>
              <label>Pet: </label>
              <select onChange={(e) => setSelectedPetId(e.target.value)}>
                <option value="">Select Pet</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
              <br />
              <label>Vet Visit Date: </label>
              <input
                type="date"
                value={newSchedule.vet_visit_date}
                onChange={(e) => setNewSchedule({ ...newSchedule, vet_visit_date: e.target.value })}
              />
              <br />
              <label>Vet Visit Time: </label>
              <input
                type="time"
                value={newSchedule.vet_visit_time}
                onChange={(e) => setNewSchedule({ ...newSchedule, vet_visit_time: e.target.value })}
              />
              <br />
              <button onClick={addSchedule}>Add Schedule</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
      <Footer2 />
    </div>
  );
};

export default PetSchedulePage;
