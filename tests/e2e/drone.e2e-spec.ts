import request from 'supertest';
import app from '../../src/app';
import * as HttpStatus from 'http-status';
import { ResponseStatus } from '../../src/shared/response.interface';
import { RegisterDronePayloadDto } from '../../src/dtos/register-drone-payload.dto';
import { getDrone } from '../fixtures/drone.fixture';
import { DroneRepository } from '../../src/repositories/drone/drone.repository';
import { IDroneRepository } from '../../src/repositories/drone/drone.repository.interface';
import { dbCreateConnection } from '../../src/shared/database/connection';
import { ErrorMessages } from '../../src/shared/messages/error-messages.enum';
import { SuccessMessages } from '../../src/shared/messages/success-messages.enum';
import { LoadItemsPayloadDto } from '../../src/dtos/load-Items-payload.dto';
import { getMedication } from '../fixtures/medication.fixture';
import { Connection } from 'typeorm';
import { IMedicationRepository } from '../../src/repositories/medication/medication.repository.interface';
import { MedicationRepository } from '../../src/repositories/medication/medication.repository';

describe('End To End Test - Drone', () => {
  const droneRepository: IDroneRepository = new DroneRepository();
  const medicationRepository: IMedicationRepository = new MedicationRepository();

  let dbConnection: Connection;
  beforeAll(async () => {
    dbConnection = await dbCreateConnection({ isTest: true, migrate: true });
  });

  afterEach(async () => {
    await medicationRepository.deleteAll();
    await droneRepository.deleteAll();
  });

  afterAll(async () => {
    // close connection
    await dbConnection.close();
  });
  describe('POST: /drones/register', () => {
    it('it should throw a bad request error if request body is empty', async (done) => {
      const response = await request(app).post('/api/drones/register').set('Accept', 'application/json');
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.status).toBe(ResponseStatus.ERROR);
      done();
    });

    it('it should throw a bad request error if drone exists already', async (done) => {
      const mockDroneData = getDrone();
      await droneRepository.create(mockDroneData);
      const payload = new RegisterDronePayloadDto();
      payload.serialNumber = mockDroneData.serialNumber;
      payload.model = mockDroneData.model;
      payload.weight = mockDroneData.weight;
      payload.battery = mockDroneData.battery;
      const response = await request(app).post('/api/drones/register').set('Accept', 'application/json').send(payload);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe(ErrorMessages.DRONE_ALREADY_EXISTS);
      expect(response.body.status).toBe(ResponseStatus.ERROR);
      done();
    });

    it('it should return registered drone details', async (done) => {
      const mockDroneData = getDrone();
      const payload = new RegisterDronePayloadDto();
      payload.serialNumber = mockDroneData.serialNumber;
      payload.model = mockDroneData.model;
      payload.weight = mockDroneData.weight;
      payload.battery = mockDroneData.battery;
      const response = await request(app).post('/api/drones/register').set('Accept', 'application/json').send(payload);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.message).toBe(SuccessMessages.REGISTER_DRONE_SUCCESS);
      expect(response.body.status).toBe(ResponseStatus.SUCCESS);
      done();
    });
  });

  describe('POST: /drones/:droneId/load', () => {
    it('it should throw a bad request error if request body is empty', async (done) => {
      const droneId = 1;
      const response = await request(app).post(`/api/drones/${droneId}/load`).set('Accept', 'application/json');
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.status).toBe(ResponseStatus.ERROR);
      done();
    });

    it('it should throw an error if drone does not exist', async (done) => {
      const payload = new LoadItemsPayloadDto();
      const mockMedicationData = getMedication({ weight: 100, code: 'ABC', name: 'MEDICATION' });
      payload.medications = [
        {
          code: mockMedicationData.code,
          image: mockMedicationData.image,
          name: mockMedicationData.name,
          weight: mockMedicationData.weight,
        },
      ];
      const droneId = 1;
      const response = await request(app)
        .post(`/api/drones/${droneId}/load`)
        .set('Accept', 'application/json')
        .send(payload);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.message).toBe(ErrorMessages.DRONE_NOT_FOUND);
      expect(response.body.status).toBe(ResponseStatus.ERROR);
      done();
    });

    it('it should throw an error if drone battery is low', async (done) => {
      const drone = await droneRepository.create(getDrone({ battery: 10 }));
      const payload = new LoadItemsPayloadDto();
      const mockMedicationData = getMedication({ weight: 100 });
      payload.medications = [
        {
          code: mockMedicationData.code,
          image: mockMedicationData.image,
          name: mockMedicationData.name,
          weight: mockMedicationData.weight,
        },
      ];
      const droneId = drone.id;
      const response = await request(app)
        .post(`/api/drones/${droneId}/load`)
        .set('Accept', 'application/json')
        .send(payload);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe(ErrorMessages.LOW_BATTERY);
      expect(response.body.status).toBe(ResponseStatus.ERROR);
      done();
    });

    it('it should throw an error if medication has been loaded already', async (done) => {
      const drone = await droneRepository.create(getDrone({ battery: 50, weight: 300 }));
      const payload = new LoadItemsPayloadDto();
      const mockMedicationData = getMedication({ weight: 100, droneId: drone.id });
      await medicationRepository.create(mockMedicationData);
      payload.medications = [
        {
          code: mockMedicationData.code,
          image: mockMedicationData.image,
          name: mockMedicationData.name,
          weight: mockMedicationData.weight,
        },
      ];
      const droneId = drone.id;
      const response = await request(app)
        .post(`/api/drones/${droneId}/load`)
        .set('Accept', 'application/json')
        .send(payload);
      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body.message).toBe(`Medication with code '${mockMedicationData.code}' has been loaded already`);
      expect(response.body.status).toBe(ResponseStatus.ERROR);
      done();
    });

    it('it should throw an error if medication weight exceeds drone max weight', async (done) => {
      const drone = await droneRepository.create(getDrone({ battery: 50, weight: 50 }));
      const payload = new LoadItemsPayloadDto();
      const mockMedicationData = getMedication({ weight: 100, droneId: drone.id });
      payload.medications = [
        {
          code: mockMedicationData.code,
          image: mockMedicationData.image,
          name: mockMedicationData.name,
          weight: mockMedicationData.weight,
        },
      ];
      const droneId = drone.id;
      const response = await request(app)
        .post(`/api/drones/${droneId}/load`)
        .set('Accept', 'application/json')
        .send(payload);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe(ErrorMessages.MAX_WEIGHT_EXCEEDED);
      expect(response.body.status).toBe(ResponseStatus.ERROR);
      done();
    });

    it('it should return success response with drone details', async (done) => {
      const drone = await droneRepository.create(getDrone({ battery: 50, weight: 200 }));
      const payload = new LoadItemsPayloadDto();
      const mockMedicationData = getMedication({ weight: 100, droneId: drone.id });
      payload.medications = [
        {
          code: mockMedicationData.code,
          image: mockMedicationData.image,
          name: mockMedicationData.name,
          weight: mockMedicationData.weight,
        },
      ];
      const droneId = drone.id;
      const response = await request(app)
        .post(`/api/drones/${droneId}/load`)
        .set('Accept', 'application/json')
        .send(payload);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.status).toBe(ResponseStatus.SUCCESS);
      expect(response.body.message).toBe(SuccessMessages.LOAD_DRONE_SUCCESS);
      expect(response.body.data.id).toBe(droneId);
      expect(response.body.data.medications.length).toBeGreaterThan(0);
      done();
    });
  });

  describe('GET: /drones/:droneId/medications', () => {
    it('it should throw an error if drone is not found', async (done) => {
      const droneId = 1;
      const response = await request(app).get(`/api/drones/${droneId}/medications`).set('Accept', 'application/json');
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.status).toBe(ResponseStatus.ERROR);
      expect(response.body.message).toBe(ErrorMessages.DRONE_NOT_FOUND);
      done();
    });

    it('it should return success response with a list of medications', async (done) => {
      const drone = await droneRepository.create(getDrone({ battery: 50, weight: 200 }));
      const droneId = drone.id;
      const response = await request(app).get(`/api/drones/${droneId}/medications`).set('Accept', 'application/json');
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.status).toBe(ResponseStatus.SUCCESS);
      expect(response.body.message).toBe(SuccessMessages.MEDICATIONS_RETRIEVED);
      expect(response.body.data).toBeInstanceOf(Array);
      done();
    });
  });

  describe('GET: /drones', () => {
    it('it should return a list of drones', async (done) => {
      await droneRepository.create(getDrone());
      const response = await request(app).get(`/api/drones`).set('Accept', 'application/json');
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.status).toBe(ResponseStatus.SUCCESS);
      expect(response.body.message).toBe(SuccessMessages.DRONE_FETCHED);
      expect(response.body.data).toHaveProperty('drones');
      expect(response.body.data.drones).toBeInstanceOf(Array);
      expect(response.body.data).toHaveProperty('count');
      expect(response.body.data.count).toBeGreaterThan(0);
      expect(response.body.data.drones.length).toBeGreaterThan(0);
      expect(response.body.data.drones.length).toBe(response.body.data.count);
      expect(response.body.data.drones[0]).toHaveProperty('id');
      done();
    });

    it('it should return success response with drones that are available for loading', async (done) => {
      await droneRepository.create(getDrone({ battery: 50 }));
      const response = await request(app)
        .get(`/api/drones?isAvailableForLoading=true`)
        .set('Accept', 'application/json');
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.status).toBe(ResponseStatus.SUCCESS);
      expect(response.body.message).toBe(SuccessMessages.DRONE_FETCHED);
      expect(response.body.data).toHaveProperty('drones');
      expect(response.body.data.drones).toBeInstanceOf(Array);
      expect(response.body.data).toHaveProperty('count');
      expect(response.body.data.count).toBeGreaterThan(0);
      expect(response.body.data.drones.length).toBeGreaterThan(0);
      expect(response.body.data.drones.length).toBe(response.body.data.count);
      expect(response.body.data.drones[0]).toHaveProperty('id');
      expect(response.body.data.drones[0].battery).toBeGreaterThanOrEqual(25);
      done();
    });

    it('it should return success response with drones that are not available for loading', async (done) => {
      await droneRepository.create(getDrone({ battery: 20 }));
      const response = await request(app)
        .get(`/api/drones?isAvailableForLoading=false`)
        .set('Accept', 'application/json');
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.status).toBe(ResponseStatus.SUCCESS);
      expect(response.body.message).toBe(SuccessMessages.DRONE_FETCHED);
      expect(response.body.data).toHaveProperty('drones');
      expect(response.body.data.drones).toBeInstanceOf(Array);
      expect(response.body.data).toHaveProperty('count');
      expect(response.body.data.count).toBeGreaterThan(0);
      expect(response.body.data.drones.length).toBeGreaterThan(0);
      expect(response.body.data.drones.length).toBe(response.body.data.count);
      expect(response.body.data.drones[0]).toHaveProperty('id');
      expect(response.body.data.drones[0].battery).toBeLessThan(25);
      done();
    });
  });
});
