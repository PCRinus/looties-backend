import { IsNotEmpty, IsUUID } from 'class-validator';

export class OpenLootboxDto {
  @IsNotEmpty()
  @IsUUID()
  readonly userId: string;
}
