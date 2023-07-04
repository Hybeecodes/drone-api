import { Drone } from '../entities/drone.entity';
import { Medication } from '../entities/medication.entity';

export class DroneMedicationDto {
  id: number;
  name: string;
  weight: number;
  code: string;
  image: string;

  constructor(medication: Medication) {
    this.id = medication.id;
    this.name = medication.name;
    this.weight = medication.weight;
    this.code = medication.code;
    this.image = medication.image;
  }
}

export class DroneWithMedicationDto {
  id: number;
  battery: number;
  model: string;
  serialNumber: string;
  state: string;
  weight: number;
  medications: DroneMedicationDto[];

  constructor(drone: Drone) {
    this.id = drone.id;
    this.battery = drone.battery;
    this.model = drone.model;
    this.serialNumber = drone.serialNumber;
    this.state = drone.state;
    this.weight = drone.weight;
    this.medications = drone.medications.map((medication) => {
      return new DroneMedicationDto(medication);
    });
  }
}
