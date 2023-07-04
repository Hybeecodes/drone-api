import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Drone } from './drone.entity';
import { DroneState } from '../enums/drone-state.enum';

@Entity()
export class DroneAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Drone)
  @JoinColumn({ name: 'droneId' })
  drone: Drone;

  @Column({ name: 'droneId', nullable: false })
  droneId: number;

  @Column({ nullable: false, type: 'float' })
  battery: number;

  @Column({ type: 'enum', enum: DroneState, nullable: false })
  state: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
