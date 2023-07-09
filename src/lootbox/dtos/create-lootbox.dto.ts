import { IsDecimal, IsNotEmpty, IsString } from 'class-validator';

interface Token {
  id: string;
  amount: string;
  dropChance: string;
}

interface Nft {
  id: string;
  dropChance: string;
}
export class CreateLootboxDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsDecimal()
  readonly price: string;

  @IsNotEmpty()
  readonly tokens: Token;

  @IsNotEmpty()
  readonly nft: Nft;
}
