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
  const [showModal, setShowModal] = useState(false); // Vet Modal
  const [showFeedingModal, setShowFeedingModal] = useState(false);  // Feeding Modal
  const [showGroomingModal, setShowGroomingModal] = useState(false); // Grooming Modal
  const [newSchedule, setNewSchedule] = useState({
    vet_visit_time: '',
    vet_visit_date: '',
  });
  const [newFeedingSchedule, setNewFeedingSchedule] = useState({
    feeding_time: '',
    feeding_date: '',
  });
  const [newGroomingSchedule, setNewGroomingSchedule] = useState({
    grooming_time: '',
    grooming_date: '',
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

  // add to feeding schedule
  const addFeedingSchedule = () => {
    if (!selectedPetId) {
      alert('Please select a pet.');
      return;
    }

    const scheduleData = {
      feeding_time: newFeedingSchedule.feeding_time,
      feeding_date: newFeedingSchedule.feeding_date,
    };

    axios
      .post(`/api/users/${userId}/pets/${selectedPetId}/feeding_schedule`, scheduleData)
      .then((response) => {
        console.log('Feeding schedule added:', response.data);
        // Update the schedules and activeDates states
        setFeedingSchedules((prevSchedules) => [
          ...prevSchedules,
          response.data,
        ]);
        setShowFeedingModal(false);
      })
      .catch((error) => {
        console.error('Error adding feeding schedule:', error);
      });
  };

  // add to grooming schedule
  const addGroomingSchedule = () => {
    if (!selectedPetId) {
      alert('Please select a pet.');
      return;
    }

    const scheduleData = {
      grooming_time: newGroomingSchedule.grooming_time,
      grooming_date: newGroomingSchedule.grooming_date,
    };

    axios
      .post(`/api/users/${userId}/pets/${selectedPetId}/grooming_schedule`, scheduleData)
      .then((response) => {
        console.log('Grooming schedule added:', response.data);
        setGroomingSchedules((prevSchedules) => [
          ...prevSchedules,
          response.data,
        ]);
        setShowGroomingModal(false);
      })
      .catch((error) => {
        console.error('Error adding grooming schedule:', error);
      });
  };

  // Function to delete vet schedule by date
const deleteVetSchedule = (vet_visit_date) => {
  axios
    .delete(`/api/users/${userId}/pets/schedules`, { data: { vet_visit_date } })
    .then(() => {
      setVetSchedules((prevSchedules) =>
        prevSchedules.filter((schedule) => schedule.vet_visit_date !== vet_visit_date)
      );
      setActiveDates((prevDates) =>
        prevDates.filter((date) => date !== vet_visit_date)
      );
      alert('Vet schedule deleted successfully.');
    })
    .catch((error) => {
      console.error('Error deleting vet schedule:', error);
    });
};

// Function to delete feeding schedule by date
const deleteFeedingSchedule = (feeding_date) => {
  axios
    .delete(`/api/users/${userId}/pets/feeding_schedule?feeding_date=${feeding_date}`)
    .then(() => {
      setFeedingSchedules((prevSchedules) =>
        prevSchedules.filter((schedule) => schedule.feeding_date !== feeding_date)
      );
      alert('Feeding schedule deleted successfully.');
    })
    .catch((error) => {
      console.error('Error deleting feeding schedule:', error.response || error.message);
      alert('An error occurred while deleting the feeding schedule.');
    });
};

// Function to delete grooming schedule by date
const deleteGroomingSchedule = (grooming_date) => {
  axios
    .delete(`/api/users/${userId}/pets/grooming_schedule`, { data: { grooming_date } })
    .then(() => {
      setGroomingSchedules((prevSchedules) =>
        prevSchedules.filter((schedule) => schedule.grooming_date !== grooming_date)
      );
      setActiveDates((prevDates) =>
        prevDates.filter((date) => date !== grooming_date)
      );
      alert('Grooming schedule deleted successfully.');
    })
    .catch((error) => {
      console.error('Error deleting grooming schedule:', error);
      alert('An error occurred while deleting the grooming schedule.');
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
        <h2>Selected Date: {date.toDateString()}</h2>
        {selectedSchedules.length > 0 ? (
          <ul>
            {selectedSchedules.map((schedule, index) => (
              <li key={index}>
                <strong>Pet Name:</strong> {schedule.pet_name} <br />
                {schedule.vet_visit_time && (
                  <>
                    <strong>Vet Time:</strong> {schedule.vet_visit_time} <br />
                    <strong>Vet Visit:</strong> {schedule.vet_visit_date} <br />
                    <button className="delete-button" onClick={() => deleteVetSchedule(schedule.vet_visit_date)}>
                      Delete
                    </button>
                  </>
                )}
                {schedule.feeding_time && (
                  <>
                    <strong>Feeding Time:</strong> {schedule.feeding_time} <br />
                    <strong>Feeding Date:</strong> {schedule.feeding_date} <br />
                    <button className="delete-button" onClick={() => deleteFeedingSchedule(schedule.feeding_date)}>
                      Delete
                    </button>
                  </>
                )}
                {schedule.grooming_time && (
                  <>
                    <strong>Grooming Time:</strong> {schedule.grooming_time} <br />
                    <strong>Grooming Date:</strong> {schedule.grooming_date} <br />
                    <button className="delete-button" onClick={() => deleteGroomingSchedule(schedule.grooming_date)}>
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No activities scheduled for this date.</p>
        )}

        <button className="button-add" onClick={() => setShowModal(true)}>
          Add Vet Visit Schedule
        </button>
        <button className="button-add" onClick={() => setShowFeedingModal(true)}>
          Add Feeding Schedule
        </button>
        <button className="button-add" onClick={() => setShowGroomingModal(true)}>
          Add Grooming Schedule
        </button>

        {/* Modal for adding a new schedule */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add Vet Schedule</h3>
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
              <button className="button-add" onClick={addSchedule}>Add Schedule</button>
              <button className="delete-button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for adding feeding schedule */}
      {showFeedingModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add Feeding Schedule</h2>
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
              <label>Feeding Time:</label>
              <input
                type="time"
                value={newFeedingSchedule.feeding_time}
                onChange={(e) =>
                  setNewFeedingSchedule({...newFeedingSchedule, feeding_time: e.target.value,})}
              />
              <br />
              <label>Feeding Date:</label>
              <input
                type="date"
                value={newFeedingSchedule.feeding_date}
                onChange={(e) =>
                  setNewFeedingSchedule({...newFeedingSchedule, feeding_date: e.target.value,})}
              />
              <br />              
              <button className="button-add" onClick={addFeedingSchedule}>Add Feeding Schedule</button>
              <button className="delete-button" onClick={() => setShowFeedingModal(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Modal for adding grooming schedule */}
        {showGroomingModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add Grooming Schedule</h2>
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
              <label>Grooming Time:</label>
              <input
                type="time"
                value={newGroomingSchedule.grooming_time}
                onChange={(e) =>
                  setNewGroomingSchedule({...newGroomingSchedule, grooming_time: e.target.value,})}
              />
              <br />
              <label>Grooming Date:</label>
              <input
                type="date"
                value={newGroomingSchedule.grooming_date}
                onChange={(e) =>
                  setNewGroomingSchedule({...newGroomingSchedule, grooming_date: e.target.value,})}
              />
              <br />
              <button className="button-add" onClick={addGroomingSchedule}>Add Grooming Schedule</button>
              <button className="delete-button" onClick={() => setShowGroomingModal(false)}>Cancel</button>
            </div>
          </div>
        )}
    <Footer2 />
    </div>
  );
};

export default PetSchedulePage;
