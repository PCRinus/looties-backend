import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ReplyMessageDto {
  @IsUUID(4)
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly reply: string;

  @IsUUID(4)
  @IsNotEmpty()
  readonly originalMessageId: string;
}
