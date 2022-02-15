import { exec } from 'child_process';
import { getEnvironments } from './environment';

interface Options {
    cluster: string;
    namespace: string;
    name: string;
    value: string;
}

export async function sealSecret(options: Options) {
    const environments = await getEnvironments();

    const matchingEnvironment = environments.find(
        (environment) => environment.name === options.cluster
    )!;

    return new Promise<string>((resolve, reject) => {
        const flags = [
            `--raw`,
            `--from-file /dev/stdin`,
            `--namespace ${options.namespace}`,
            `--name ${options.name}`,
            `--cert ${matchingEnvironment.path}`,

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
