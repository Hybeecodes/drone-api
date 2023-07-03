import {IDroneRepository} from "../../repositories/drone/drone.repository.interface";
import {ILogger} from "../../shared/services/logger/logger.service.interface";
import {RegisterDronePayloadDto} from "../../dtos/register-drone-payload.dto";
import HttpException from "../../shared/exceptions/http-exception";
import * as HttpStatus from 'http-status';
import {IDroneService} from "./drone.service.interface";
import {ErrorMessages} from "../../shared/messages/error-messages.enum";
import {DroneDto} from "../../dtos/drone.dto";

export class DroneService implements IDroneService {
    constructor(
        private readonly droneRepository: IDroneRepository,
        private readonly logger: ILogger,
    ) {}

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
            this.logger.error(e);
            throw new HttpException(ErrorMessages.REGISTER_DRONE_FAILURE, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
