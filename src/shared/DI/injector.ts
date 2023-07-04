import { serviceLocator } from './service-locator';
import { Constants } from './constants';
import { WinstonLogger } from '../services/logger/winston-logger.service';
import { ConfigService } from '../services/config/config.service';
import { HomeController } from '../../controllers/home.controller';
import { IConfigService } from '../services/config/config.service.interface';
import { DroneRepository } from '../../repositories/drone/drone.repository';
import { DroneService } from '../../services/drone/drone.service';
import { IDroneRepository } from '../../repositories/drone/drone.repository.interface';
import { IDroneService } from '../../services/drone/drone.service.interface';
import { DroneController } from '../../controllers/drone.controller';
import { MedicationRepository } from '../../repositories/medication/medication.repository';
import { IMedicationRepository } from '../../repositories/medication/medication.repository.interface';
import { CronService } from '../../services/cron/cron.service';
import { DroneAuditRepository } from '../../repositories/drone-audit/drone-audit.repository';
import { IDroneAuditRepository } from '../../repositories/drone-audit/drone-audit.repository.interface';

/**
 * @summary This helper file uses the service locator to register dependencies
 */
serviceLocator.register(Constants.LOGGER, () => {
  return WinstonLogger;
});

serviceLocator.register(Constants.CONFIG_SERVICE, () => {
  return new ConfigService();
});

serviceLocator.register(Constants.HOME_CONTROLLER, () => {
  const configService = serviceLocator.get<IConfigService>(Constants.CONFIG_SERVICE);
  return new HomeController(configService);
});

serviceLocator.register(Constants.DRONE_REPOSITORY, () => {
  return new DroneRepository();
});

serviceLocator.register(Constants.MEDICATION_REPOSITORY, () => {
  return new MedicationRepository();
});

serviceLocator.register(Constants.DRONE_AUDIT_REPOSITORY, () => {
  return new DroneAuditRepository();
});

serviceLocator.register(Constants.DRONE_SERVICE, () => {
  const droneRepository = serviceLocator.get<IDroneRepository>(Constants.DRONE_REPOSITORY);
  const medicationRepository = serviceLocator.get<IMedicationRepository>(Constants.MEDICATION_REPOSITORY);
  return new DroneService(droneRepository, medicationRepository);
});

serviceLocator.register(Constants.DRONE_CONTROLLER, () => {
  const droneService = serviceLocator.get<IDroneService>(Constants.DRONE_SERVICE);
  return new DroneController(droneService);
});

serviceLocator.register(Constants.CRON_SERVICE, () => {
  const droneRepository = serviceLocator.get<IDroneRepository>(Constants.DRONE_REPOSITORY);
  const droneAuditRepository = serviceLocator.get<IDroneAuditRepository>(Constants.DRONE_AUDIT_REPOSITORY);
  return new CronService(droneAuditRepository, droneRepository);
});

export default serviceLocator;
