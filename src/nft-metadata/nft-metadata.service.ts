import { Metaplex } from '@metaplex-foundation/js';
import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Connection, PublicKey } from '@solana/web3.js';

import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';

@Injectable()
export class NftMetadataService implements OnModuleInit {
  constructor(private readonly rpcConnectionService: RpcConnectionService) {}

  private _connection: Connection;
  private _metaplex: Metaplex;

  onModuleInit() {
    this._connection = this.rpcConnectionService.getRpcConnection();
    this._metaplex = new Metaplex(this._connection);
  }

  async getNftMetadata(mintAddress: PublicKey) {
    const metadata = await this._metaplex.nfts().findByMint({ mintAddress });

    return metadata;
  }
}
