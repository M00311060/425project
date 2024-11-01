// Run these test with npx jest

const request = require('supertest');
const app = require('../index');  // Make sure to export the Express app in your index.js file

describe('API Endpoints', () => {
  // Define test variables for ids
  let userId, petId, scheduleId, medicalRecordId;

  // Users API
  describe('Users API', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ username: 'test_user', password: 'test_pass' });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      userId = res.body.id;
    });

    it('should fetch all users', async () => {
      const res = await request(app).get('/api/users');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should fetch a user by ID', async () => {
      const res = await request(app).get(`/api/users/${userId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty('id', userId);
    });

    it('should update a user by ID', async () => {
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .send({ username: 'updated_user', password: 'new_pass' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('updatedID', userId.toString());
    });

    it('should delete a user by ID', async () => {
      const res = await request(app).delete(`/api/users/${userId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('deletedID', userId.toString());
    });
  });

  // Pets API
  describe('Pets API', () => {
    it('should create a new pet', async () => {
      const res = await request(app)
        .post('/api/pets')
        .send({
          user_id: userId,
          name: 'Test Pet',
          species: 'Dog',
          breed: 'Labrador',
          feeding_schedule: 'Morning',
          medical_history: 'None',
          care_needs: 'Daily exercise',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      petId = res.body.id;
    });

    it('should fetch all pets', async () => {
      const res = await request(app).get('/api/pets');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should fetch a pet by ID', async () => {
      const res = await request(app).get(`/api/pets/${petId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty('id', petId);
    });

    it('should update a pet by ID', async () => {
      const res = await request(app)
        .put(`/api/pets/${petId}`)
        .send({
          user_id: userId,
          name: 'Updated Pet',
          species: 'Dog',
          breed: 'Beagle',
          feeding_schedule: 'Evening',
          medical_history: 'None',
          care_needs: 'Daily walks',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('updatedID', petId.toString());
    });

    it('should delete a pet by ID', async () => {
      const res = await request(app).delete(`/api/pets/${petId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('deletedID', petId.toString());
    });
  });

  // Schedules API
  describe('Schedules API', () => {
    it('should create a new schedule', async () => {
      const res = await request(app)
        .post('/api/schedules')
        .send({
          pet_id: petId,
          feeding_time: '08:00',
          grooming_time: '10:00',
          vet_visit: '2024-12-01',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      scheduleId = res.body.id;
    });

    it('should fetch all schedules', async () => {
      const res = await request(app).get('/api/schedules');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should fetch a schedule by ID', async () => {
      const res = await request(app).get(`/api/schedules/${scheduleId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty('id', scheduleId);
    });

    it('should update a schedule by ID', async () => {
      const res = await request(app)
        .put(`/api/schedules/${scheduleId}`)
        .send({
          pet_id: petId,
          feeding_time: '09:00',
          grooming_time: '11:00',
          vet_visit: '2024-12-02',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('updatedID', scheduleId.toString());
    });

    it('should delete a schedule by ID', async () => {
      const res = await request(app).delete(`/api/schedules/${scheduleId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('deletedID', scheduleId.toString());
    });
  });

  // Medical Records API
  describe('Medical Records API', () => {
    it('should create a new medical record', async () => {
      const res = await request(app)
        .post('/api/medical-records')
        .send({ pet_id: petId, record: 'Routine check-up: All clear' });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      medicalRecordId = res.body.id;
    });

    it('should fetch all medical records', async () => {
      const res = await request(app).get('/api/medical-records');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should fetch a medical record by ID', async () => {
      const res = await request(app).get(`/api/medical-records/${medicalRecordId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty('id', medicalRecordId);
    });

    it('should update a medical record by ID', async () => {
      const res = await request(app)
        .put(`/api/medical-records/${medicalRecordId}`)
        .send({ pet_id: petId, record: 'Updated record: All clear' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('updatedID', medicalRecordId.toString());
    });

    it('should delete a medical record by ID', async () => {
      const res = await request(app).delete(`/api/medical-records/${medicalRecordId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('deletedID', medicalRecordId.toString());
    });
  });
});
