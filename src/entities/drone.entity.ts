import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {DroneModel} from "../enums/drone-model.enum";
import {DroneState} from "../enums/drone-state.enum";
import {Medication} from "./medication.entity";

@Entity({name: 'drones'})
export class Drone {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true, type: 'varchar', length: 255})
    serialNumber: string;

    @Column({enum: DroneModel, nullable: false})
    model: string;

    @Column({type: 'smallint', nullable: false})
    weight: number;

    @Column({type: 'smallint', nullable: false})
    battery: number;

    @Column({enum: DroneState, nullable: false})
    state: string;

    @OneToMany(() => Medication, medication => medication.drone)
    medications: Medication[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
