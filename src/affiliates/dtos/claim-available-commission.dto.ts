import { IsDecimal, IsNotEmpty, IsUUID } from 'class-validator';
import Decimal from 'decimal.js';

export class ClaimAvailableCommissionDto {
  @IsNotEmpty()
  @IsUUID()
  readonly userId: string;

  @IsDecimal()
  @IsNotEmpty()
  readonly availableCommission: Decimal;

  @IsDecimal()
  @IsNotEmpty()
  readonly referralEarnings: Decimal;
}
