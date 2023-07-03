import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateMeditationsTable1688395808671 implements MigrationInterface {

    name = 'CreateMeditationsTable1688395808671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE `medications` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `weight` float NOT NULL, `code` varchar(255) NOT NULL, `image` varchar(255) NOT NULL, `droneId` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_e7d083f0778f731c0bd1a6fc78` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
        );
        await queryRunner.query(
            'ALTER TABLE `medications` ADD CONSTRAINT `FK_7e178b4e3e43342eadaf00fc32f` FOREIGN KEY (`droneId`) REFERENCES `drones`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `medications` DROP FOREIGN KEY `FK_7e178b4e3e43342eadaf00fc32f`');
        await queryRunner.query('DROP INDEX `IDX_e7d083f0778f731c0bd1a6fc78` ON `medications`');
        await queryRunner.query('DROP TABLE `medications`');
    }

}
