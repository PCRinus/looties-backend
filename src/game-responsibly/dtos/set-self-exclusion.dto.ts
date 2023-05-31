import { IsNotEmpty, IsNumber } from 'class-validator';

export class SetSelfExclusion {
  @IsNumber()
  @IsNotEmpty()
  readonly timePeriodDays: number;
}
