import { CoreOutput } from '@common/common.interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}

  async uploadToS3(
    file: Express.Multer.File,
    uid: string,
    folderName = 'uploads/',
  ): Promise<string> {
    const { originalname, filename, buffer } = file;

    try {
      const { Location } = await this.getS3()
        .upload({
          Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
          Key: `${folderName}-${uid}-${Date.now()}-${filename || originalname}`,
          ACL: 'public-read',
          Body: buffer,
        })
        .promise();
      return Location.length > 255 ? Location.slice(0, 255) : Location;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  async deleteFromS3(fileName: string): Promise<CoreOutput> {
    try {
      this.getS3().deleteObject({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Key: fileName,
      });
    } catch (error) {
      return { ok: false, error };
    }
  }

  private getS3() {
    return new AWS.S3({
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      },
      region: 'ap-northeast-2',
    });
  }
}
