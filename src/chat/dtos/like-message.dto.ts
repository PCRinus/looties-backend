import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class LikeMessageDto {
  @IsUUID(4)
  @IsNotEmpty()
  readonly userId: string;

  @IsUUID(4)
  @IsNotEmpty()
  readonly messageId: string;
}