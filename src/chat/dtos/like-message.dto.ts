import { IsNotEmpty, IsUUID } from 'class-validator';

export class LikeMessageDto {
  @IsUUID()
  @IsNotEmpty()
  readonly userId: string;

  @IsUUID()
  @IsNotEmpty()
  readonly messageId: string;
}
