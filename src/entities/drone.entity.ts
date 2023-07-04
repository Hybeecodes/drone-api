import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DroneModel } from '../enums/drone-model.enum';
import { DroneState } from '../enums/drone-state.enum';
import { Medication } from './medication.entity';

@Entity({ name: 'drones' })
export class Drone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true, type: 'varchar', length: 255 })
  serialNumber: string;

  @Column({ type: 'enum', enum: DroneModel, nullable: false })
  model: string;

  @Column({ type: 'float', nullable: false })
  weight: number;

  @Column({ type: 'float', nullable: false })
  battery: number;

  @Column({ type: 'enum', enum: DroneState, nullable: false, default: DroneState.IDLE })
  state: string;

  @OneToMany(() => Medication, (medication) => medication.drone)
  medications?: Medication[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export interface IDroneDto {
  id: number;
  serialNumber: string;
  model: string;
  weight: number;
  battery: number;
  state: string;
}
