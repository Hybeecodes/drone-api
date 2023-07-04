import { Drone } from '../../src/entities/drone.entity';
import Chance from 'chance';
import { DroneModel } from '../../src/enums/drone-model.enum';
import { DroneState } from '../../src/enums/drone-state.enum';

const chance = new Chance();

export const getDrone = (overrides?: Partial<Drone>): Partial<Drone> => {
  const drone = new Drone();
  drone.id = chance.integer({ min: 1, max: 100 });
  drone.model = chance.pickone(Object.values(DroneModel));
  drone.battery = chance.integer({ min: 1, max: 100 });
  drone.serialNumber = chance.string({ length: 10 });
  drone.weight = chance.integer({ min: 1, max: 100 });
  drone.state = chance.pickone(Object.values(DroneState));
  drone.medications = [];
  drone.createdAt = new Date();
  drone.updatedAt = new Date();
  return { ...drone, ...overrides };
};
