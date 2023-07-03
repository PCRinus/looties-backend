import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTokenDepositDto {
  @IsNotEmpty()
  @IsString()
  readonly txHash: string;

  @IsNotEmpty()
  @IsNumber()
  lamports: number;
}
