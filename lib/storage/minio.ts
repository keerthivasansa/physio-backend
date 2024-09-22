import * as Minio from 'minio'
import { secrets } from '$lib/config';
import internal from 'stream';

const minio = new Minio.Client({
    endPoint: secrets.MINIO_ENDPOINT,
    accessKey: secrets.MINIO_ACCESS_KEY,
    secretKey: secrets.MINIO_SECRET_KEY,
    useSSL: true,
});

export function uploadFile(file: string, bucket: string, stream: internal.Readable) {
    return minio.putObject(bucket, file, stream)
}

export function getSignedUrl(file: string, bucket: string, expiry: number) {
    return minio.presignedUrl('GET', bucket, file, expiry)
}