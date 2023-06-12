import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectWalletDto {
  @IsNotEmpty()
  @IsString()
  readonly walletAddress: string;

  @IsNotEmpty()
  @IsString()
  readonly signature: string;
}
