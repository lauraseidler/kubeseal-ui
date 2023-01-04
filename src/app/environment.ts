import { Storage } from '@google-cloud/storage';

const BUCKET_URL = process.env.BUCKET_URL;

export type Environment = {
    name: string;
    path: string;
};

async function getEnvironmentsFromGoogleBucket(
    bucketName: string
): Promise<Environment[]> {
    const storage = new Storage();

    const [files] = await storage.bucket(bucketName).getFiles();

    return files.map((file) => ({
        name: file.metadata.name.replace(/\.\w*$/, ''),
        path: file.metadata.mediaLink,
    }));
}

export async function getEnvironments() {
    // If we have a Google bucket, download objects from there
    if (BUCKET_URL && BUCKET_URL.startsWith('gs://')) {
        return getEnvironmentsFromGoogleBucket(BUCKET_URL.replace('gs://', ''));
    }

    throw new Error('Unsupported or no bucket url!');
}
