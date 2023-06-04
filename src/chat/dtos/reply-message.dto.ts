import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ReplyMessageDto {
  @IsUUID(4)
  @IsNotEmpty()
  readonly userId: string;

  @IsUUID(4)
  @IsNotEmpty()
  readonly messageId: string;

  @IsString()
  @IsNotEmpty()
  readonly reply: string;
}
