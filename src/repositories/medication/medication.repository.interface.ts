import { Medication } from '../../entities/medication.entity';
import { IBaseRepository } from '../base.repository.interface';

export interface IMedicationRepository extends IBaseRepository<Medication> {
  findMedicationByCode(code: string): Promise<Medication>;

  findMedicationsByDroneId(droneId: number): Promise<Medication[]>;
}
