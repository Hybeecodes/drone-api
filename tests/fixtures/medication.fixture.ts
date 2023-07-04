import Chance from 'chance';

import { Medication } from '../../src/entities/medication.entity';

const chance = new Chance();

export const getMedication = (overrides?: Partial<Medication>): Partial<Medication> => {
  const medication = new Medication();
  medication.id = chance.integer({ min: 1, max: 100 });
  medication.name = chance.string({ length: 10, alpha: true }).toUpperCase();
  medication.weight = chance.integer({ min: 1, max: 100 });
  medication.code = chance.string({ length: 5, alpha: true });
  medication.image = chance.url();
  return { ...medication, ...overrides };
};
