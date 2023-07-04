import { RegisterDronePayloadDto } from '../../dtos/register-drone-payload.dto';
import { IDroneDto } from '../../entities/drone.entity';
import { LoadItemsPayloadDto } from '../../dtos/load-Items-payload.dto';
import { DroneMedicationDto, DroneWithMedicationDto } from '../../dtos/drone-with-medication.dto';
import { GetDronesQueryDto } from '../../dtos/get-drones-query.dto';
import { DroneDto } from '../../dtos/drone.dto';

export interface IDroneService {
  register(drone: RegisterDronePayloadDto): Promise<IDroneDto>;
  load(droneId: number, payload: LoadItemsPayloadDto): Promise<DroneWithMedicationDto>;
  retrieveDroneMedications(droneId: number): Promise<DroneMedicationDto[]>;
  getDrones(query: GetDronesQueryDto): Promise<{ count: number; drones: DroneDto[] }>;
  getDroneDetails(droneId: number): Promise<DroneDto>;
}
