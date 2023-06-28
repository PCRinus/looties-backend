import { IsDecimal, IsNotEmpty } from 'class-validator';
import Decimal from 'decimal.js';

export class WithdrawDto {
  @IsNotEmpty()
  @IsDecimal()
  readonly tokenAmount: Decimal;
}
