import { IsDecimal, IsNotEmpty } from 'class-validator';

export class WithdrawSolDto {
  @IsNotEmpty()
  @IsDecimal()
  readonly amount: string;
}
