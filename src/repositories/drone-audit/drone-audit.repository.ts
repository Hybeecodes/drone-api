import { IDroneAuditRepository } from './drone-audit.repository.interface';
import { DroneAudit } from '../../entities/drone-audit.entity';
import { getRepository } from 'typeorm';

export class DroneAuditRepository implements IDroneAuditRepository {
  async create(item: Partial<DroneAudit>): Promise<DroneAudit> {
    const droneAuditRepository = getRepository(DroneAudit);
    const newDroneAudit = droneAuditRepository.create(item);
    return droneAuditRepository.save(newDroneAudit);
  }

  async delete(id: number): Promise<void> {
    await getRepository(DroneAudit).delete(id);
  }

  async deleteAll(): Promise<void> {
    await getRepository(DroneAudit).delete({});
  }

  async findAll(): Promise<DroneAudit[]> {
    return await getRepository(DroneAudit).find();
  }

  async findById(id: number): Promise<DroneAudit> {
    return await getRepository(DroneAudit).findOne(id);
  }

  async update(id: number, item: Partial<DroneAudit>): Promise<DroneAudit> {
    const droneAuditRepository = getRepository(DroneAudit);
    await droneAuditRepository.update(id, item);
    return await droneAuditRepository.findOne(id);
  }
}
