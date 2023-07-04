import { IMedicationRepository } from '../../../src/repositories/medication/medication.repository.interface';

export class MedicationMockRepository implements IMedicationRepository {
  public create = jest.fn(() => {
    return Promise.resolve(undefined);
  });

  public delete = jest.fn(() => {
    return Promise.resolve(undefined);
  });

  public findAll = jest.fn(() => {
    return Promise.resolve(undefined);
  });

  public findById = jest.fn(() => {
    return Promise.resolve(undefined);
  });

  public update = jest.fn(() => {
    return Promise.resolve(undefined);
  });

  public deleteAll = jest.fn(() => {
    return Promise.resolve(undefined);
  });

  public findMedicationByCode = jest.fn(() => {
    return Promise.resolve(undefined);
  });

  public findMedicationsByDroneId = jest.fn(() => {
    return Promise.resolve(undefined);
  });
}
