import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDepositDto {
  @IsNotEmpty()
  @IsString()
  readonly txHash: string;

  @IsNotEmpty()
  @IsNumber()
  lamports: number;
}
