import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ErrorMessages } from '../shared/messages/error-messages.enum';

export class MedicationPayload {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsNumber()
  weight: number;

  @IsDefined()
  @IsString()
  code: string;

  @IsDefined()
  @IsUrl()
  image: string;
}

export class LoadItemsPayloadDto {
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmptyObject({}, { message: ErrorMessages.MEDICATION_NOT_EMPTY, each: true })
  @Type(() => MedicationPayload)
  @ValidateNested()
  medications: MedicationPayload[];
}
