import { IsNotEmpty, IsUUID } from 'class-validator';

export class ItemDroppedDto {
  @IsUUID(4)
  @IsNotEmpty()
  readonly itemId: string;
}
