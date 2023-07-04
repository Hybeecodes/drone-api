import { IDroneRepository } from '../../../src/repositories/drone/drone.repository.interface';

export class DroneMockRepository implements IDroneRepository {
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

  public findBySerialNumber = jest.fn(() => {
    return Promise.resolve(undefined);
  });

  public findDroneWithMedicationsById = jest.fn(() => {
    return Promise.resolve(undefined);
  });

  public findDronesByCriteria = jest.fn(() => {
    return Promise.resolve(undefined);
  });
}
