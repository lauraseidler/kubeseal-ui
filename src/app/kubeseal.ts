import { exec } from 'child_process';
import fs from 'fs/promises';
import { getEnvironments } from './environment';

interface Options {
    cluster: string;
    namespace: string;
    name: string;
    value: string;
}

export async function sealSecret(options: Options) {
    const environments = getEnvironments();

    const certificateFileName = `/tmp/${options.cluster}-certificate.txt`;

    // Write certificate to disk (while we're not mounting certificates as files)
    await fs.writeFile(
        certificateFileName,
        environments.find(
            (environment) => environment.name === options.cluster
        )!.certificate
    );

    return new Promise<string>((resolve, reject) => {
        const flags = [
            `--raw`,
            `--from-file /dev/stdin`,
            `--namespace ${options.namespace}`,
            `--name ${options.name}`,
            `--cert ${certificateFileName}`,

            // Kubeseal is looking for a kube config - nope :)
            `--kubeconfig /dev/null`,
        ];

        exec(
            `echo -n '${options.value}' | kubeseal ${flags.join(' ')}`,
            (error, stdout) => {
                if (error) {
                    return reject(error);
                }

                return resolve(stdout);
            }
        );
    });
}
