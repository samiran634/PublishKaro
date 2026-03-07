import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * S3 Upload Service
 * Uploads documents to S3 so the Bedrock Flow agents can access them.
 */

class S3Uploader {
    constructor() {
        this.client = new S3Client({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                ...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN }),
            },
        });

        this.bucket = process.env.AWS_S3_BUCKET;
        this.keyPrefix = process.env.AWS_S3_KEY_PREFIX || 'submissions/';
    }

    /**
     * Upload a file buffer to S3
     * @param {Buffer} fileBuffer - The file content
     * @param {string} originalFilename - Original filename for extension detection
     * @param {string} contentType - MIME type (default: application/pdf)
     * @returns {Promise<{ s3Uri: string, bucket: string, key: string }>}
     */
    async upload(fileBuffer, originalFilename, contentType = 'application/pdf') {
        if (!this.bucket) {
            throw new Error('AWS_S3_BUCKET environment variable is not set');
        }

        const ext = path.extname(originalFilename) || '.pdf';
        const key = `${this.keyPrefix}${randomUUID()}${ext}`;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType,
        });

        console.log(`[S3 Uploader] Uploading to s3://${this.bucket}/${key} ...`);
        await this.client.send(command);

        const s3Uri = `s3://${this.bucket}/${key}`;
        console.log(`[S3 Uploader] Upload complete: ${s3Uri}`);

        return { s3Uri, bucket: this.bucket, key };
    }
}

const s3Uploader = new S3Uploader();
export default s3Uploader;
