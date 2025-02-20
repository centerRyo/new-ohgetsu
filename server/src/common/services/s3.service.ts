import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    this.s3 = new S3Client({
      region: 'jp-north-1',
      endpoint: process.env.SAKURA_OBJECT_STORAGE_ENDPOINT,
      credentials: {
        accessKeyId: process.env.SAKURA_OBJECT_STORAGE_ACCESS_KEY,
        secretAccessKey: process.env.SAKURA_OBJECT_STORAGE_SECRET_KEY,
      },
      forcePathStyle: true,
    });

    this.bucketName = process.env.SAKURA_OBJECT_STORAGE_BUCKET_NAME;
  }

  async uploadFile({
    file,
    folder,
  }: {
    file: Express.Multer.File;
    folder: string;
  }): Promise<string> {
    const fileKey = `${folder}${folder ? '/' : ''}$${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      },
    });

    await upload.done();

    return `${process.env.SAKURA_OBJECT_STORAGE_ENDPOINT}/${this.bucketName}/${fileKey}`;
  }
}
