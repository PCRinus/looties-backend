import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectWalletDto {
  @IsNotEmpty()
  @IsString()
  readonly walletPublicKey: string;

  @IsNotEmpty()
  @IsString()
  readonly signature: string;
}
