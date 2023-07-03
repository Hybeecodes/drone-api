import { IDroneRepository } from './drone.repository.interface';
import { Drone } from '../../entities/drone.entity';
import { getRepository } from 'typeorm';
import { GetDronesQueryDto } from 'src/dtos/get-drones-query.dto';

export class DroneRepository implements IDroneRepository {
  async create(item: Partial<Drone>): Promise<Drone> {
    const droneRepository = getRepository(Drone);
    const newDrone = await droneRepository.create(item);
    return await droneRepository.save(newDrone);
  }

  async delete(id: number): Promise<void> {
    await getRepository(Drone).delete(id);
  }

  async deleteAll(): Promise<void> {
    await getRepository(Drone).delete({});
  }

  async findAll(): Promise<Drone[]> {
    return await getRepository(Drone).find();
  }

  async findById(id: number): Promise<Drone> {
    return await getRepository(Drone).findOne(id);
  }

  async update(id: number, item: Partial<Drone>): Promise<Drone> {
    const droneRepository = getRepository(Drone);
    await droneRepository.update(id, item);
    return await droneRepository.findOne(id);
  }

  async findBySerialNumber(serialNumber: string): Promise<Drone> {
    return await getRepository(Drone).findOne({ serialNumber });
  }

  async findDroneWithMedicationsById(id: number): Promise<Drone> {
    const droneRepository = getRepository(Drone);
    return await droneRepository.findOne(id, { relations: ['medications'] });
  }

  async findDronesByCriteria(criteria: GetDronesQueryDto): Promise<[Drone[], number]> {
    const { offset, isAvailableForLoading, limit } = criteria;
    const builder = getRepository(Drone).createQueryBuilder('drones');
    if (isAvailableForLoading !== undefined && isAvailableForLoading !== null) {
      if (isAvailableForLoading === 'true') {
        builder.where('battery >= 25');
      } else {
        builder.where('battery < 25');
      }
    }
    return builder
        .skip(offset || 0)
        .take(limit || 10)
        .getManyAndCount();
  }
}
