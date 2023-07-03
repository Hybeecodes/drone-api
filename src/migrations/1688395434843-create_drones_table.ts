import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateDronesTable1688395434843 implements MigrationInterface {
    name = 'CreateDronesTable1688395434843'
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `drones` (`id` int NOT NULL AUTO_INCREMENT, `serialNumber` varchar(255) NOT NULL, `model` enum ('Lightweight', 'Middleweight', 'Cruiserweight', 'Heavyweight') NOT NULL, `weight` smallint NOT NULL, `battery` smallint NOT NULL, `state` enum ('Idle', 'Loading', 'Loaded', 'Delivering', 'Delivered', 'Returning') NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_6bb8e28fb98e053a8f69a732c5` (`serialNumber`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_6bb8e28fb98e053a8f69a732c5` ON `drones`");
        await queryRunner.query("DROP TABLE `drones`");
    }

}
