import { IMedicationRepository } from './medication.repository.interface';
import { Medication } from '../../entities/medication.entity';
import { getRepository } from 'typeorm';

export class MedicationRepository implements IMedicationRepository {
  async create(item: Partial<Medication>): Promise<Medication> {
    const medicationRepository = getRepository(Medication);
    const newMedication = medicationRepository.create(item);
    return await medicationRepository.save(newMedication);
  }

  async delete(id: number): Promise<void> {
    await getRepository(Medication).delete(id);
  }

  async deleteAll(): Promise<void> {
    await getRepository(Medication).delete({});
  }

  async findAll(): Promise<Medication[]> {
    return await getRepository(Medication).find();
  }

  async findById(id: number): Promise<Medication> {
    return await getRepository(Medication).findOne(id);
  }

  async update(id: number, item: Partial<Medication>): Promise<Medication> {
    const medicationRepository = getRepository(Medication);
    await medicationRepository.update(id, item);
    return await medicationRepository.findOne(id);
  }

  async findMedicationByCode(code: string): Promise<Medication> {
    return await getRepository(Medication).findOne({ code });
  }

  findMedicationsByDroneId(droneId: number): Promise<Medication[]> {
    const medicationRepository = getRepository(Medication);
    return medicationRepository.find({ where: { droneId } });
  }
}
