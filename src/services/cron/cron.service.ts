import { ICronService } from './cron.service.interface';
import { ILogger } from '../../shared/services/logger/logger.service.interface';
import { WinstonLogger } from '../../shared/services/logger/winston-logger.service';
import cron from 'node-cron';
import { IDroneAuditRepository } from '../../repositories/drone-audit/drone-audit.repository.interface';
import { IDroneRepository } from '../../repositories/drone/drone.repository.interface';

export class CronService implements ICronService {
  private readonly logger: ILogger;

  constructor(
    private readonly droneAuditRepository: IDroneAuditRepository,
    private readonly droneRepository: IDroneRepository
  ) {
    this.logger = new WinstonLogger(CronService.name);
  }

  runDronesAudit(): void {
    // runs every 10 hours
    cron.schedule('0 0-23/10 * * *', () => {
      this.logger.log('runDronesAudit Cron Starting');
      return new Promise(async (resolve, reject) => {
        try {
          const drones = await this.droneRepository.findAll();
          for (const drone of drones) {
            const droneAudit = await this.droneAuditRepository.create({
              droneId: drone.id,
              battery: drone.battery,
              state: drone.state,
            });
            this.logger.log(`Drone Audit Created: ${JSON.stringify(droneAudit)}`);
          }
          resolve('runDronesAudit Cron Finished');
        } catch (error) {
          this.logger.error(error);
          reject(error);
        }
      });
    });
  }
}
