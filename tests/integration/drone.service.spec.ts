import { DroneService } from '../../src/services/drone/drone.service';
import { IDroneRepository } from '../../src/repositories/drone/drone.repository.interface';
import { RegisterDronePayloadDto } from '../../src/dtos/register-drone-payload.dto';
import { getDrone } from '../fixtures/drone.fixture';
import { DroneMockRepository } from '../mocks/repositories/drone.mock.repository';
import HttpException from '../../src/shared/exceptions/http-exception';
import { ErrorMessages } from '../../src/shared/messages/error-messages.enum';
import * as HttpStatus from 'http-status';
import { DroneDto } from '../../src/dtos/drone.dto';
import { IMedicationRepository } from '../../src/repositories/medication/medication.repository.interface';
import { MedicationMockRepository } from '../mocks/repositories/medication.mock.repository';
import { LoadItemsPayloadDto } from '../../src/dtos/load-Items-payload.dto';
import { getMedication } from '../fixtures/medication.fixture';
import { DroneMedicationDto, DroneWithMedicationDto } from '../../src/dtos/drone-with-medication.dto';
import { GetDronesQueryDto } from '../../src/dtos/get-drones-query.dto';
import { DroneState } from '../../src/enums/drone-state.enum';

describe('DroneService', () => {
  let droneRepository: IDroneRepository;
  let medicationRepository: IMedicationRepository;

  let service: DroneService;

  beforeAll(() => {
    droneRepository = new DroneMockRepository();
    medicationRepository = new MedicationMockRepository();
    service = new DroneService(droneRepository, medicationRepository);
  });

  describe('DroneService should be Defined', () => {
    it('should pass', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Register Drone', () => {
    let findBySerialNumberMock: jest.SpyInstance;
    let createDroneMock: jest.SpyInstance;

    beforeEach(() => {
      findBySerialNumberMock = jest.spyOn(droneRepository, 'findBySerialNumber');
      createDroneMock = jest.spyOn(droneRepository, 'create');
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should throw an error if the drone already exists', async () => {
      const mockDroneData = getDrone();
      findBySerialNumberMock.mockResolvedValue(mockDroneData);
      const payload = new RegisterDronePayloadDto();
      payload.serialNumber = mockDroneData.serialNumber;
      payload.model = mockDroneData.model;
      payload.weight = mockDroneData.weight;
      payload.battery = mockDroneData.battery;

      try {
        await service.register(payload);
      } catch (e: any) {
        expect(findBySerialNumberMock).toBeCalledTimes(1);
        expect(createDroneMock).toBeCalledTimes(0);
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe(ErrorMessages.DRONE_ALREADY_EXISTS);
        expect(e.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should return a registered drone', async () => {
      const mockDroneData = getDrone();
      findBySerialNumberMock.mockResolvedValue(null);
      createDroneMock.mockResolvedValue(mockDroneData);
      const payload = new RegisterDronePayloadDto();
      payload.serialNumber = mockDroneData.serialNumber;
      payload.model = mockDroneData.model;
      payload.weight = mockDroneData.weight;
      payload.battery = mockDroneData.battery;

      const registeredDrone = await service.register(payload);
      expect(registeredDrone).toBeInstanceOf(DroneDto);
      expect(registeredDrone).toHaveProperty('id', mockDroneData.id);
      expect(registeredDrone).toHaveProperty('serialNumber', mockDroneData.serialNumber);
    });
  });

  describe('Load Drone', () => {
    let findDroneWithMedicationsByIdMock: jest.SpyInstance;
    let findMedicationByCodeMock: jest.SpyInstance;
    let updateDroneMock: jest.SpyInstance;

    beforeEach(() => {
      findDroneWithMedicationsByIdMock = jest.spyOn(droneRepository, 'findDroneWithMedicationsById');
      findMedicationByCodeMock = jest.spyOn(medicationRepository, 'findMedicationByCode');
      updateDroneMock = jest.spyOn(droneRepository, 'update');
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should throw an error if the drone is not found', async () => {
      findDroneWithMedicationsByIdMock.mockResolvedValue(null);
      const payload = new LoadItemsPayloadDto();
      const droneId = 1;
      const mockMedicationData = getMedication();
      payload.medications = [
        {
          code: mockMedicationData.code,
          image: mockMedicationData.image,
          name: mockMedicationData.name,
          weight: mockMedicationData.weight,
        },
      ];

      try {
        await service.load(droneId, payload);
      } catch (e: any) {
        expect(findDroneWithMedicationsByIdMock).toBeCalledTimes(1);
        expect(findMedicationByCodeMock).toBeCalledTimes(0);
        expect(updateDroneMock).toBeCalledTimes(0);
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe(ErrorMessages.DRONE_NOT_FOUND);
        expect(e.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an error if the medication has been loaded already', async () => {
      const mockDroneData = getDrone({ battery: 100 });
      findDroneWithMedicationsByIdMock.mockResolvedValue(mockDroneData);
      const payload = new LoadItemsPayloadDto();
      const droneId = 1;
      const mockMedicationData = getMedication();
      payload.medications = [
        {
          code: mockMedicationData.code,
          image: mockMedicationData.image,
          name: mockMedicationData.name,
          weight: mockMedicationData.weight,
        },
      ];
      findMedicationByCodeMock.mockResolvedValue(mockMedicationData);
      try {
        await service.load(droneId, payload);
      } catch (e: any) {
        expect(findDroneWithMedicationsByIdMock).toBeCalledTimes(1);
        expect(findMedicationByCodeMock).toBeCalledTimes(1);
        expect(updateDroneMock).toBeCalledTimes(0);
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe(`Medication with code '${mockMedicationData.code}' has been loaded already`);
        expect(e.status).toBe(HttpStatus.CONFLICT);
      }
    });

    it('should throw an error if drone battery is less than 25%', async () => {
      const mockDroneData = getDrone({ battery: 20 });
      findDroneWithMedicationsByIdMock.mockResolvedValue(mockDroneData);
      const payload = new LoadItemsPayloadDto();
      const droneId = 1;
      const mockMedicationData = getMedication();
      payload.medications = [
        {
          code: mockMedicationData.code,
          image: mockMedicationData.image,
          name: mockMedicationData.name,
          weight: mockMedicationData.weight,
        },
      ];
      findMedicationByCodeMock.mockResolvedValue(mockMedicationData);
      try {
        await service.load(droneId, payload);
      } catch (e: any) {
        expect(findDroneWithMedicationsByIdMock).toBeCalledTimes(1);
        expect(findMedicationByCodeMock).toBeCalledTimes(0);
        expect(updateDroneMock).toBeCalledTimes(0);
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe(ErrorMessages.LOW_BATTERY);
        expect(e.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw an error if medication weights exceed drone max weight', async () => {
      const mockDroneData = getDrone({ battery: 100, weight: 200 });
      findDroneWithMedicationsByIdMock.mockResolvedValue(mockDroneData);
      const payload = new LoadItemsPayloadDto();
      const droneId = 1;
      const mockMedicationData = getMedication({ weight: 300 });
      payload.medications = [
        {
          code: mockMedicationData.code,
          image: mockMedicationData.image,
          name: mockMedicationData.name,
          weight: mockMedicationData.weight,
        },
      ];
      findMedicationByCodeMock.mockResolvedValue(null);
      try {
        await service.load(droneId, payload);
      } catch (e: any) {
        expect(findDroneWithMedicationsByIdMock).toBeCalledTimes(1);
        expect(findMedicationByCodeMock).toBeCalledTimes(1);
        expect(updateDroneMock).toBeCalledTimes(0);
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe(ErrorMessages.MAX_WEIGHT_EXCEEDED);
        expect(e.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should return the drone with all loaded medications', async () => {
      const mockDroneData = getDrone({ battery: 100, weight: 200 });
      findDroneWithMedicationsByIdMock.mockResolvedValue(mockDroneData);
      const payload = new LoadItemsPayloadDto();
      const droneId = mockDroneData.id;
      const mockMedicationData = getMedication({ weight: 100 });
      payload.medications = [
        {
          code: mockMedicationData.code,
          image: mockMedicationData.image,
          name: mockMedicationData.name,
          weight: mockMedicationData.weight,
        },
      ];
      findMedicationByCodeMock.mockResolvedValue(null);
      const response = await service.load(droneId, payload);
      expect(response).toBeInstanceOf(DroneWithMedicationDto);
      expect(response.id).toBe(mockDroneData.id);
      expect(findDroneWithMedicationsByIdMock).toBeCalledTimes(2);
      expect(findMedicationByCodeMock).toBeCalledTimes(1);
      expect(updateDroneMock).toBeCalledTimes(1);
      expect(updateDroneMock).toBeCalledWith(mockDroneData.id, { state: DroneState.LOADED });
    });
  });

  describe('Retrieve Drone Medications', () => {
    let findByIdMock: jest.SpyInstance;
    let findMedicationsByDroneIdMock: jest.SpyInstance;

    beforeEach(() => {
      findByIdMock = jest.spyOn(droneRepository, 'findById');
      findMedicationsByDroneIdMock = jest.spyOn(medicationRepository, 'findMedicationsByDroneId');
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should throw an error if the drone is not found', async () => {
      findByIdMock.mockResolvedValue(null);
      const droneId = 1;

      try {
        await service.retrieveDroneMedications(droneId);
      } catch (e: any) {
        expect(findByIdMock).toBeCalledTimes(1);
        expect(findMedicationsByDroneIdMock).toBeCalledTimes(0);
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe(ErrorMessages.DRONE_NOT_FOUND);
        expect(e.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should return a list of medications for specified drone', async () => {
      const droneId = 1;
      findByIdMock.mockResolvedValue(getDrone({ id: droneId }));
      findMedicationsByDroneIdMock.mockResolvedValue([getMedication({ droneId })]);
      const response = await service.retrieveDroneMedications(droneId);
      expect(response).toBeInstanceOf(Array);
      expect(response[0]).toBeInstanceOf(DroneMedicationDto);
    });
  });

  describe('Get Drones', () => {
    let findDronesByCriteriaMock: jest.SpyInstance;

    beforeEach(() => {
      findDronesByCriteriaMock = jest.spyOn(droneRepository, 'findDronesByCriteria');
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should return success response', async () => {
      findDronesByCriteriaMock.mockResolvedValue([[], 0]);
      const payload = new GetDronesQueryDto();
      const response = await service.getDrones(payload);
      expect(response).toHaveProperty('count');
      expect(response).toHaveProperty('drones');
      expect(findDronesByCriteriaMock).toBeCalledTimes(1);
    });
  });

  describe('Get Drone Details', () => {
    let findByIdMock: jest.SpyInstance;

    beforeEach(() => {
      findByIdMock = jest.spyOn(droneRepository, 'findById');
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should return drone details', async () => {
      const drone = getDrone();
      findByIdMock.mockResolvedValue(drone);
      const response = await service.getDroneDetails(drone.id);
      expect(response).toBeInstanceOf(DroneDto);
      expect(findByIdMock).toBeCalledTimes(1);
    });

    it('should throw an error if drone is not found', async () => {
      findByIdMock.mockResolvedValue(null);
      try {
        await service.getDroneDetails(1);
      } catch (e: any) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe(ErrorMessages.DRONE_NOT_FOUND);
        expect(e.status).toBe(HttpStatus.NOT_FOUND);
        expect(findByIdMock).toBeCalledTimes(1);
      }
    });
  });
});
