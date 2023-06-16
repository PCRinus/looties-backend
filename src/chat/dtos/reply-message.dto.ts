import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ReplyMessageDto {
  @IsUUID()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly reply: string;

  @IsUUID()
  @IsNotEmpty()
  readonly originalMessageId: string;
}
