import { Router } from 'express';
import { serviceLocator } from '../shared/DI/service-locator';
import { DroneController } from '../controllers/drone.controller';
import { Constants } from '../shared/DI/constants';
import { validateBody } from '../shared/middlewares/validator.middleware';
import { RegisterDronePayloadDto } from '../dtos/register-drone-payload.dto';
import { LoadItemsPayloadDto } from '../dtos/load-Items-payload.dto';

const droneController = serviceLocator.get<DroneController>(Constants.DRONE_CONTROLLER);

const router = Router();

router.get('', droneController.fetchDrones); // this endpoint returns all drones (can also get drones by query params, isAvailableForLoading, etc)
router.post('/register', validateBody(RegisterDronePayloadDto), droneController.register);
router.get('/:id', droneController.fetchDroneDetails); // this endpoint returns drone details (including battery)
router.post('/:id/load', validateBody(LoadItemsPayloadDto), droneController.load);
router.get('/:id/medications', droneController.retrieveMedications);

export default router;
