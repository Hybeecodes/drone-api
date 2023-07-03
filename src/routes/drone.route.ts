import {Router} from "express";
import {serviceLocator} from "../shared/DI/service-locator";
import {DroneController} from "../controllers/drone.controller";
import {Constants} from "../shared/DI/constants";
import {validateBody} from "../shared/middlewares/validator.middleware";
import {RegisterDronePayloadDto} from "../dtos/register-drone-payload.dto";

const droneController = serviceLocator.get<DroneController>(Constants.DRONE_CONTROLLER);

const router = Router();


router.post('/register', validateBody(RegisterDronePayloadDto), droneController.register);

export default router;
