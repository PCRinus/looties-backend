import { IsNotEmpty, IsString } from 'class-validator';

export class WithdrawNftDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  readonly mintAddress: string;
}
