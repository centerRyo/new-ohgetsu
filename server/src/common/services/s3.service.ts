import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
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

    // Sakura Object Storage は Expect: 100-continue ヘッダー非対応のため削除
    this.s3.middlewareStack.add(
      (next) => async (args: any) => {
        delete args.request.headers['Expect'];
        delete args.request.headers['expect'];
        return next(args);
      },
      { step: 'finalizeRequest', name: 'removeExpectHeader', priority: 'low' },
    );
  }

  async uploadFile({
    file,
    folder,
  }: {
    file: Express.Multer.File;
    folder: string;
  }): Promise<string> {
    const fileKey = `${folder}${folder ? '/' : ''}${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      }),
    );

    return `${process.env.SAKURA_OBJECT_STORAGE_ENDPOINT}/${this.bucketName}/${fileKey}`;
  }
}
