import type { OnModuleInit } from '@nestjs/common';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Decimal from 'decimal.js';

import { NftService } from '@@nft/nft.service';
import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';
import { TokensService } from '@@tokens/tokens.service';
import { TransactionsService } from '@@transactions/transactions.service';

type WithdrawNftPayload = {
  id: string;
  mintAddress: string;
};

@Injectable()
export class WithdrawalService implements OnModuleInit {
  private readonly logger = new Logger(WithdrawalService.name);

  constructor(
    private readonly transactionService: TransactionsService,
    private readonly rpcConnectionService: RpcConnectionService,
    private readonly tokensService: TokensService,
    private readonly nftService: NftService,
    private readonly configService: ConfigService,
  ) {}

  private _houseWalletSecret: string;
  private _maxWithdrawalAmount: Decimal;

  onModuleInit() {
    this._houseWalletSecret = this.configService.get<string>('HOUSE_WALLET_SECRET') ?? '';
    if (!this._houseWalletSecret) {
      throw new InternalServerErrorException('House wallet is not defined, withdrawals can not be created');
    }

    const maxWithdrawalAmount = this.configService.get<string>('MAX_WITHDRAWAL_AMOUNT');
    this._maxWithdrawalAmount = maxWithdrawalAmount ? new Decimal(maxWithdrawalAmount) : new Decimal(0);
    if (this._maxWithdrawalAmount.lessThanOrEqualTo(0)) {
      throw new InternalServerErrorException('MAX_WITHDRAWAL_AMOUNT is not defined or is less than or equal to 0');
    }
  }

  async withdrawTokens(userId: string, walletPublicKey: string, tokenAmount: Decimal): Promise<string> {
    this.logger.log(
      `Token withdrawal request for user ${userId} with wallet ${walletPublicKey} for ${tokenAmount} tokens`,
    );

    await this.checkIfUserCanWithdrawTokens(userId, tokenAmount);

    const transactionId = await this.transactionService.createNewTransaction(userId, {
      transactionType: 'WITHDRAWAL',
      coinsAmount: tokenAmount,
    });

    const signature = await this.signTokenWithdrawal(walletPublicKey, tokenAmount, transactionId);

    await this.transactionService.updateTransaction(transactionId, {
      status: 'APPROVED',
      transactionHash: signature,
      coinsAmount: tokenAmount,
    });
    this.logger.log(`Transaction ${transactionId} updated with status APPROVED and transaction hash ${signature}`);

    await this.tokensService.withdraw(userId, tokenAmount);
    this.logger.log(`${tokenAmount} tokens withdrawn from user ${userId} balance`);

    return signature;
  }

  private async checkIfUserCanWithdrawTokens(userId: string, tokenAmount: Decimal): Promise<void> {
    this.logger.log(`Checking if user can withdraw ${tokenAmount} tokens...`);

    if (tokenAmount.lessThan(0)) {
      throw new BadRequestException('Token amount can not be negative');
    }

    if (tokenAmount.greaterThanOrEqualTo(this._maxWithdrawalAmount)) {
      throw new BadRequestException('Token amount is greater than max withdrawal amount');
    }

    const tokenBalance = await this.tokensService.getBalance(userId);
    if (tokenBalance.lessThan(tokenAmount)) {
      throw new BadRequestException('User does not have enough tokens to withdraw');
    }
  }

  private async signTokenWithdrawal(
    payeePublicKey: string,
    withdrawalAmount: Decimal,
    transactionId: number,
  ): Promise<string> {
    this.logger.log(`Withdrawing ${withdrawalAmount} tokens for user with wallet ${payeePublicKey}`);

    try {
      const { blockhash, lastValidBlockHeight } = await this.rpcConnectionService.getLatestBlockhash();
      const signature = await this.tokensService.signTransfer(
        withdrawalAmount,
        this._houseWalletSecret,
        payeePublicKey,
        blockhash,
      );

      const isTransactionValid = await this.rpcConnectionService.isTransactionValid(signature, lastValidBlockHeight);

      if (!isTransactionValid) {
        throw new Error();
      }

      this.logger.log(`Withdrawal created with signature ${signature}`);
      return signature;
    } catch (error) {
      this.logger.error(error);
      await this.transactionService.updateTransactionStatus(transactionId, 'DECLINED');

      throw new InternalServerErrorException('Failed to create withdrawal');
    }
  }

  async withdrawNfts(userId: string, walletPublicKey: string, payload: WithdrawNftPayload[]): Promise<string[]> {
    this.logger.log(`Nft withdrawal request for user ${userId} with wallet ${walletPublicKey}...`);

    const signatures: Array<string> = [];

    for await (const nftDo of payload) {
      const { id: nftId, mintAddress } = nftDo;
      const transactionId = await this.transactionService.createNewTransaction(userId, {
        transactionType: 'WITHDRAWAL',
        mintAddress,
      });

      try {
        await this.canUserWithdrawNft(userId, nftId);

        const { signature, lastValidBlockHeight } = await this.nftService.signTransfer(mintAddress, walletPublicKey);

        const isTransactionValid = await this.rpcConnectionService.isTransactionValid(signature, lastValidBlockHeight);
        if (!isTransactionValid) {
          throw new Error();
        }

        signatures.push(signature);
      } catch (error) {
        this.logger.error(error);
        await this.transactionService.updateTransactionStatus(transactionId, 'DECLINED');

        continue;
      }
    }

    return signatures;
  }

  private async canUserWithdrawNft(userId: string, nftId: string): Promise<boolean> {
    this.logger.log(`Checking if user ${userId} can withdraw NFT ${nftId}...`);

    //TODO: any conditional logic on withdrawing an NFT, such as minimum time in platform
    return true;
  }
}
