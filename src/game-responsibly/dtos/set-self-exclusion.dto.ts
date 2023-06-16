import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class SetSelfExclusion {
  @IsUUID()
  @IsNotEmpty()
  readonly userId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly timePeriodDays: number;
}
