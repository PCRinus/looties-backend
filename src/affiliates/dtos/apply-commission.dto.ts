import { IsDecimal, IsNotEmpty } from 'class-validator';
import Decimal from 'decimal.js';

export class ApplyCommissionDto {
  @IsNotEmpty()
  @IsDecimal()
  readonly wagerAmount: Decimal;
}
