import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateReferralCodeDto {
  @IsNotEmpty()
  @IsString()
  readonly updatedReferralCode: string;
}
