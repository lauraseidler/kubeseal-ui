const VARIABLE_PREFIX = 'KUBESEAL_CERTIFICATE_';

export type Environment = {
    name: string;
    certificate: string;
};

export function getEnvironments() {
    const allEnvironmentVariables = Object.keys(process.env);

    const relevantEnvironmentVariables = allEnvironmentVariables.filter(
        (variableName) => variableName.startsWith(VARIABLE_PREFIX)
    );

    const environments: Environment[] = relevantEnvironmentVariables.map(
        (variableName) => ({
            // Remove prefix and use rest of variable as environment name
            name: variableName.replace(VARIABLE_PREFIX, ''),

            // Certificates are base64 encoded
            certificate: Buffer.from(
                process.env[variableName]!,
                'base64'
            ).toString('ascii'),
        })
    );

    return environments;
}
