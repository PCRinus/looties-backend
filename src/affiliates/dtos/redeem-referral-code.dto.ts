import { IsNotEmpty, IsString } from 'class-validator';

export class RedeemReferralCodeDto {
  @IsNotEmpty()
  @IsString()
  readonly referralCode: string;
}
