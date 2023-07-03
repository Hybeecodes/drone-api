import {RegisterDronePayloadDto} from "../../dtos/register-drone-payload.dto";
import {IDroneDto} from "../../entities/drone.entity";

export interface IDroneService {
    register(drone: RegisterDronePayloadDto): Promise<IDroneDto>;
}
