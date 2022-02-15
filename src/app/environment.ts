import fs from 'fs/promises';

const CERTIFICATES_PATH = process.env.CERTIFICATES_PATH || '/srv/certificates';

export type Environment = {
    name: string;
    path: string;
};

export async function getEnvironments() {
    // Get all files in the directory
    const files = await fs.readdir(CERTIFICATES_PATH);

    // Create an array with the data we need
    const environments: Environment[] = files.map((fileName) => ({
        name: fileName.replace(/\.\w*$/, '').toUpperCase(),
        path: `${CERTIFICATES_PATH}/${fileName}`,
    }));

    return environments;
}
