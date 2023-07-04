import { NextFunction, RequestHandler, Request, Response } from 'express';
import { RegisterDronePayloadDto } from '../dtos/register-drone-payload.dto';
import { ResponseDto } from '../shared/response.dto';
import { ResponseStatus } from '../shared/response.interface';
import * as HttpStatus from 'http-status';
import { IDroneService } from '../services/drone/drone.service.interface';
import { SuccessMessages } from '../shared/messages/success-messages.enum';
import { LoadItemsPayloadDto } from '../dtos/load-Items-payload.dto';
import { GetDronesQueryDto } from '../dtos/get-drones-query.dto';

export class DroneController {
    constructor(private readonly droneService: IDroneService) {}

    register: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const drone = await this.droneService.register(req.body as RegisterDronePayloadDto);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.REGISTER_DRONE_SUCCESS, drone);
            return res.status(HttpStatus.CREATED).json(resObj);
        } catch (e) {
            next(e);
        }
    };

    load: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const droneId = Number(req.params.id);
            const drone = await this.droneService.load(droneId, req.body as LoadItemsPayloadDto);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.LOAD_DRONE_SUCCESS, drone);
            return res.status(HttpStatus.CREATED).json(resObj);
        } catch (e) {
            next(e);
        }
    };

    retrieveMedications: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const droneId = Number(req.params.id);
            const medications = await this.droneService.retrieveDroneMedications(droneId);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.MEDICATIONS_RETRIEVED, medications);
            return res.status(HttpStatus.OK).json(resObj);
        } catch (e) {
            next(e);
        }
    };

    fetchDrones: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.droneService.getDrones((req.query as unknown) as GetDronesQueryDto);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.DRONE_FETCHED, response);
            return res.status(HttpStatus.OK).json(resObj);
        } catch (e) {
            next(e);
        }
    };

    fetchDroneDetails: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const droneId = Number(req.params.id);
            const response = await this.droneService.getDroneDetails(droneId);
            const resObj = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.DRONE_FETCHED_DETAILS, response);
            return res.status(HttpStatus.OK).json(resObj);
        } catch (e) {
            next(e);
        }
    };
}
