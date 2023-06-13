import { IsNotEmpty, IsUUID } from 'class-validator';

export class ItemDroppedDto {
  @IsUUID()
  @IsNotEmpty()
  readonly itemId: string;

  @IsUUID()
  @IsNotEmpty()
  readonly lootboxId: string;
}
