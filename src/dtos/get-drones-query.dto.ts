import { IsBooleanString, IsInt, IsOptional, Min } from 'class-validator';

export class GetDronesQueryDto {
  @IsOptional()
  @IsBooleanString()
  isAvailableForLoading: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  limit: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset: number;
}
