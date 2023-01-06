import childProcess from 'child_process';
import { getEnvironments } from './environment';

interface Options {
    cluster: string;
    scope: string;
    namespace: string | null;
    name: string | null;
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
            `--scope ${options.scope}`,
            options.namespace ? `--namespace ${options.namespace}` : '',
            options.name ? `--name ${options.name}` : '',
            `--cert "${matchingEnvironment.path}"`,

            // Kubeseal is looking for a kube config - nope :)
            `--kubeconfig /dev/null`,
        ];

        childProcess.exec(
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
