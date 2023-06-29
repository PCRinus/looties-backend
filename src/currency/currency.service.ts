import { HttpService } from '@nestjs/axios';
import type { OnModuleInit } from '@nestjs/common';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Decimal from 'decimal.js';
import { lastValueFrom, map } from 'rxjs';

type CurrencyData = {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
    };
  };
};

type CmcSuccessResponse = {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string;
    elapsed: number;
    credit_count: number;
  };
  data: CurrencyData[];
};

type CmcErrorResponse = {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string;
    elapsed: number;
    credit_count: number;
  };
};

@Injectable()
export class CurrencyService implements OnModuleInit {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(private readonly http: HttpService, private readonly configService: ConfigService) {}

  private _cmcUrl: string;
  private _cmcApiKey: string;

  onModuleInit() {
    this._cmcUrl = this.configService.get<string>('CMC_URL') ?? '';
    if (!this._cmcUrl) {
      throw new InternalServerErrorException('CMC_URL is not defined');
    }

    this._cmcApiKey = this.configService.get<string>('CMC_API_KEY') ?? '';
    if (!this._cmcApiKey) {
      throw new InternalServerErrorException('CMC_API_KEY is not defined');
    }
  }

  async getTokenToSolExchangeRate(): Promise<Decimal> {
    return new Decimal(1.2);
  }

  async getSolData(): Promise<CurrencyData> {
    const cmcUrl = `${this._cmcUrl}/v1/cryptocurrency/listings/latest`;
    this.logger.log(`Fetching SOL data from ${cmcUrl}`);

    const solData$ = this.http
      .get<CmcSuccessResponse | CmcErrorResponse>(cmcUrl, {
        headers: {
          'X-CMC_PRO_API_KEY': this._cmcApiKey,
        },
      })
      .pipe(
        map((axiosData) => {
          const cmcData = axiosData.data;
          if (this.isCmcRequestSuccessful(cmcData)) {
            const filteredSolData = cmcData.data.find((item) => item.symbol === 'SOL');

            return filteredSolData;
          } else {
            throw new InternalServerErrorException('Failed to get SOL price from CMC');
          }
        }),
      );

    const solData = await lastValueFrom(solData$);
    if (!solData) {
      throw new InternalServerErrorException('SOL price could not be fetched');
    }

    return solData;
  }

  private isCmcRequestSuccessful(data: CmcSuccessResponse | CmcErrorResponse): data is CmcSuccessResponse {
    return (data as CmcErrorResponse).status.error_code === 0;
  }
}
