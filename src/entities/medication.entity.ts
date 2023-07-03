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

@Entity({ name: 'medications' })
export class Medication {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'varchar', length: 255 })
    name: string;

    @Column({ nullable: false, type: 'float' })
    weight: number;

    @Column({ nullable: false, type: 'varchar', length: 255, unique: true })
    code: string;

    @Column({ nullable: false, type: 'varchar', length: 255 })
    image: string;

    @ManyToOne(() => Drone, (drone) => drone.medications)
    @JoinColumn({ name: 'droneId' })
    drone: Drone;

    @Column({ name: 'droneId', nullable: false })
    droneId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
