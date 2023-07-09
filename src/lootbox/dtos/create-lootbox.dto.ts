import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLootboxDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
