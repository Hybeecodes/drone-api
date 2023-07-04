import { IDroneRepository } from '../../repositories/drone/drone.repository.interface';
import { RegisterDronePayloadDto } from '../../dtos/register-drone-payload.dto';
import HttpException from '../../shared/exceptions/http-exception';
import * as HttpStatus from 'http-status';
import { IDroneService } from './drone.service.interface';
import { ErrorMessages } from '../../shared/messages/error-messages.enum';
import { ILogger } from '../../shared/services/logger/logger.service.interface';
import { WinstonLogger } from '../../shared/services/logger/winston-logger.service';
import { DroneDto } from '../../dtos/drone.dto';
import { LoadItemsPayloadDto, MedicationPayload } from '../../dtos/load-Items-payload.dto';
import { IMedicationRepository } from '../../repositories/medication/medication.repository.interface';
import { DroneMedicationDto, DroneWithMedicationDto } from '../../dtos/drone-with-medication.dto';
import { GetDronesQueryDto } from '../../dtos/get-drones-query.dto';
import { DroneState } from '../../enums/drone-state.enum';

export class DroneService implements IDroneService {
  private readonly logger: ILogger;
  constructor(
    private readonly droneRepository: IDroneRepository,
    private readonly meditationRepository: IMedicationRepository
  ) {
    this.logger = new WinstonLogger(DroneService.name);
  }

  /**
   * Register a new drone
   * @param  {RegisterDronePayloadDto} drone
   * @returns {Promise<DroneDto>}
   * @throws {HttpException}
   */
  async register(drone: RegisterDronePayloadDto): Promise<DroneDto> {
    const existingDrone = await this.droneRepository.findBySerialNumber(drone.serialNumber);
    if (existingDrone) {
      throw new HttpException(ErrorMessages.DRONE_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
    }
    try {
      const droneToRegister = await this.droneRepository.create({
        serialNumber: drone.serialNumber,
        model: drone.model,
        battery: drone.battery,
        weight: drone.weight,
      });
      return new DroneDto(droneToRegister);
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(ErrorMessages.REGISTER_DRONE_FAILURE, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Load medications to a drone
   * @param {number} droneId
   * @param {LoadItemsPayloadDto} payload
   * @returns {Promise<DroneWithMedicationDto>}
   * @throws {HttpException}
   */
  async load(droneId: number, payload: LoadItemsPayloadDto): Promise<DroneWithMedicationDto> {
    // validate medications
    payload.medications.forEach((medication) => this.validateMedication(medication));
    const drone = await this.droneRepository.findDroneWithMedicationsById(droneId);
    if (!drone) {
      throw new HttpException(ErrorMessages.DRONE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (drone.battery < 25) {
      throw new HttpException(ErrorMessages.LOW_BATTERY, HttpStatus.BAD_REQUEST);
    }
    const { medications } = payload;
    // validate medication codes (check if anyone has been registered before)
    for (const { code } of medications) {
      const med = await this.meditationRepository.findMedicationByCode(code);
      if (med) throw new HttpException(`Medication with code '${code}' has been loaded already`, HttpStatus.CONFLICT);
    }
    // validate item weights
    let totalWeight = drone.medications.map((med) => med.weight).reduce((acc, cur) => acc + cur, 0);
    for (const { weight } of medications) {
      totalWeight += weight;
    }
    if (totalWeight > drone.weight) {
      throw new HttpException(ErrorMessages.MAX_WEIGHT_EXCEEDED, HttpStatus.BAD_REQUEST);
    }
    try {
      // create medications
      for (const medication of medications) {
        await this.meditationRepository.create({
          drone,
          weight: medication.weight,
          code: medication.code,
          name: medication.name,
          image: medication.image,
        });
      }
      await this.droneRepository.update(droneId, { state: DroneState.LOADED });
      const droneWithMedication = await this.droneRepository.findDroneWithMedicationsById(droneId);
      return new DroneWithMedicationDto(droneWithMedication);
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(ErrorMessages.DRONE_LOAD_FAILURE, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all drone medications
   * @param {number} droneId
   * @returns {Promise<DroneMedicationDto>}
   * @throws {HttpException}
   */
  async retrieveDroneMedications(droneId: number): Promise<DroneMedicationDto[]> {
    const drone = await this.droneRepository.findById(droneId);
    if (!drone) {
      throw new HttpException(ErrorMessages.DRONE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const medications = await this.meditationRepository.findMedicationsByDroneId(droneId);
    return medications.map((med) => new DroneMedicationDto(med));
  }

  /**
   * validate medication
   * @param {MedicationPayload} medication
   * @returns {void}
   * @throws {HttpException}
   */
  validateMedication(medication: MedicationPayload): void {
    const { code, name } = medication;
    if (/^[a-zA-Z0-9-_]+$/.test(code) === false) {
      throw new HttpException(ErrorMessages.INVALID_MEDICATION_CODE, HttpStatus.BAD_REQUEST);
    }
    // name must only contain uppercase letters and numbers
    if (/^[A-Z_0-9]+$/.test(name) === false) {
      throw new HttpException(ErrorMessages.INVALID_MEDICATION_NAME, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Get all drones
   * @param {GetDronesQueryDto} query
   * @returns {Promise<DroneDto[]>}
   */
  async getDrones(query: GetDronesQueryDto): Promise<{ count: number; drones: DroneDto[] }> {
    const [drones, count] = await this.droneRepository.findDronesByCriteria(query);
    return {
      count,
      drones: drones.map((drone) => new DroneDto(drone)),
    };
  }

  /**
   * Get drone by id
   * @param {number} droneId
   * @returns {Promise<DroneDto>}
   * @throws {HttpException}
   */
  async getDroneDetails(droneId: number): Promise<DroneDto> {
    const drone = await this.droneRepository.findById(droneId);
    if (!drone) {
      throw new HttpException(ErrorMessages.DRONE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return new DroneDto(drone);
  }
}
