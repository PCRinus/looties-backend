import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNftDepositDto {
  @IsNotEmpty()
  @IsString()
  readonly txHash: string;

  @IsNotEmpty()
  @IsString()
  readonly mintAddress: string;
}
