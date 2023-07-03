import {serviceLocator} from './service-locator';
import {Constants} from "./constants";
import {WinstonLogger} from "../services/logger/winston-logger.service";
import {ConfigService} from "../services/config/config.service";
import {HomeController} from "../../controllers/home.controller";
import {IConfigService} from "../services/config/config.service.interface";
import {DroneRepository} from "../../repositories/drone/drone.repository";
import {DroneService} from "../../services/drone/drone.service";
import {IDroneRepository} from "../../repositories/drone/drone.repository.interface";
import {ILogger} from "../services/logger/logger.service.interface";
import {IDroneService} from "../../services/drone/drone.service.interface";
import {DroneController} from "../../controllers/drone.controller";

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

serviceLocator.register(Constants.DRONE_SERVICE, () => {
    const droneRepository = serviceLocator.get<IDroneRepository>(Constants.DRONE_REPOSITORY);
    const logger = serviceLocator.get<ILogger>(Constants.LOGGER);
    return new DroneService(droneRepository, logger);
});

serviceLocator.register(Constants.DRONE_CONTROLLER, () => {
    const droneService = serviceLocator.get<IDroneService>(Constants.DRONE_SERVICE);
    return new DroneController(droneService);
});

export default serviceLocator;
