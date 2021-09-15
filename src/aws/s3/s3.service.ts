import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private readonly FILE_LIMIT_SIZE = 300 * 1000 * 1000; // 300MB

  constructor(private readonly configService: ConfigService) {}

  async uploadToS3(
    file: Express.Multer.File,
    uid: string,
    folderName = 'uploads/',
  ): Promise<string> {
    const { originalname, filename, buffer } = file;

    const { Location } = await this.getS3()
      .upload({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Key: `${folderName}-${uid}-${Date.now()}-${filename || originalname}`,
        ACL: 'public-read',
        Body: buffer,
      })
      .promise();
    return Location;
  }

  getS3() {
    return new AWS.S3({
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      },
      region: 'ap-northeast-2',
    });
  }
}
