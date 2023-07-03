import { IsDefined, IsEnum, IsNumber, IsString, Max, MaxLength } from 'class-validator';
import { DroneModel } from '../enums/drone-model.enum';

export class RegisterDronePayloadDto {
  @IsDefined()
  @IsString()
  @MaxLength(100, { message: 'Serial number must not exceed 100 characters' })
  serialNumber: string;

  @IsDefined()
  @IsEnum(DroneModel, { message: 'Model is not valid' })
  model: string;

  @IsDefined()
  @IsNumber()
  @Max(500, { message: 'Weight must not exceed 500kg' })
  weight: number;

  @IsDefined()
  @IsNumber()
  battery: number;
}
