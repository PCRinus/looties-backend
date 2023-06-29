import { IsDecimal, IsNotEmpty } from 'class-validator';

export class WithdrawDto {
  @IsNotEmpty()
  @IsDecimal()
  readonly amount: string;
}
