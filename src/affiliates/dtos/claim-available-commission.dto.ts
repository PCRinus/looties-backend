import { IsDecimal, IsNotEmpty } from 'class-validator';
import Decimal from 'decimal.js';

export class ClaimAvailableCommissionDto {
  @IsDecimal()
  @IsNotEmpty()
  readonly availableCommission: Decimal;

  @IsDecimal()
  @IsNotEmpty()
  readonly referralEarnings: Decimal;
}
