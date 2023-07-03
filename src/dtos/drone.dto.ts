import { Drone, IDroneDto } from '../entities/drone.entity';

export class DroneDto implements IDroneDto {
  battery: number;
  id: number;
  model: string;
  serialNumber: string;
  state: string;
  weight: number;

  constructor(drone: Drone) {
    for (const property in drone) {
      if (drone.hasOwnProperty(property)) {
        (<any>this)[property] = (<any>drone)[property];
      }
    }
  }
}
