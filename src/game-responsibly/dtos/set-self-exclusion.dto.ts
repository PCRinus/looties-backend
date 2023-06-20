import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class SetSelfExclusionDto {
  @IsUUID()
  @IsNotEmpty()
  readonly userId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly timePeriodDays: number;
}
