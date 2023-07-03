import { IBaseRepository } from '../base.repository.interface';
import { Drone } from '../../entities/drone.entity';
import { GetDronesQueryDto } from '../../dtos/get-drones-query.dto';

export interface IDroneRepository extends IBaseRepository<Drone> {
  findBySerialNumber(serialNumber: string): Promise<Drone>;

  findDroneWithMedicationsById(id: number): Promise<Drone>;

  findDronesByCriteria(criteria: GetDronesQueryDto): Promise<[Drone[], number]>;
}
