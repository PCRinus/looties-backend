import type { OnModuleInit } from '@nestjs/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AWSError } from 'aws-sdk';
import * as AWS from 'aws-sdk';
import type { ManagedUpload } from 'aws-sdk/clients/s3';
import { DateTime } from 'luxon';

@Injectable()
export class FileStorageService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  private s3: AWS.S3;

  onModuleInit() {
    const endpoint = this.configService.get<string>('SPACES_URL');
    const accessKey = this.configService.get<string>('SPACES_ACCESS_KEY');
    const secretKey = this.configService.get<string>('SPACES_SECRET_KEY');

    this.s3 = new AWS.S3({
      endpoint,
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${DateTime.now()}_${file.originalname}`;

    return new Promise((resolve, reject) => {
      this.s3
        .upload({
          Bucket: '',
          Key: fileName,
          Body: file.buffer,
          ACL: 'public-read',
        })
        .send((error: AWSError, data: ManagedUpload.SendData) => {
          if (error) {
            reject(new InternalServerErrorException('Error'));
          }

          resolve(data.Location);
        });
    });
  }
}
