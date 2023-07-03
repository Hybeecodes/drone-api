import {NextFunction, RequestHandler, Request, Response} from "express";
import {RegisterDronePayloadDto} from "../dtos/register-drone-payload.dto";
import {ResponseDto} from "../shared/response.dto";
import {ResponseStatus} from "../shared/response.interface";
import * as HttpStatus from 'http-status';
import {IDroneService} from "../services/drone/drone.service.interface";
import {SuccessMessages} from "../shared/messages/success-messages.enum";

export class DroneController {

    constructor(
        private readonly droneService: IDroneService,
    ) {}

    register: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const drone = await this.droneService.register(req.body as RegisterDronePayloadDto);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.REGISTER_DRONE_SUCCESS, drone);
            return res.status(HttpStatus.CREATED).json(resObj);
        } catch (e) {
            next(e);
        }
    }
}
