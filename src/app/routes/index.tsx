import { Fragment } from 'react';
import { ActionFunction, Form, useActionData, useLoaderData } from 'remix';
import invariant from 'tiny-invariant';
import { getEnvironments } from '~/environment';
import { sealSecret } from '~/kubeseal';

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const cluster = formData.get('cluster');
    const namespace = formData.get('namespace');
    const name = formData.get('name');
    const value = formData.get('value');

    invariant(
        typeof cluster === 'string' && !!cluster,
        'Please select a cluster'
    );

    invariant(
        typeof namespace === 'string' && !!namespace,
        'Please provide the secret namespace'
    );

    invariant(
        typeof name === 'string' && !!name,
        'Please provide the secret name'
    );

    invariant(
        typeof value === 'string' && !!value,
        'Please provide the secret value'
    );

    return sealSecret({ cluster, namespace, name, value });
};

export const loader = async () => {
    return getEnvironments();
};

export default function Index() {
    const environments = useLoaderData<Awaited<ReturnType<typeof loader>>>();

    const actionData = useActionData();

    return (
        <main style={{ padding: '1rem' }}>
            <h1>kubeseal UI</h1>

            <Form method="post">
                <fieldset>
                    <legend>Cluster</legend>

                    {environments.map((environment) => (
                        <Fragment key={environment.name}>
                            <input
                                type="radio"
                                name="cluster"
                                value={environment.name}
                                id={`cluster-${environment.name}`}
                            />

                            <label
                                className="label-inline"
                                htmlFor={`cluster-${environment.name}`}
                            >
                                {environment.name}
                            </label>
                        </Fragment>
                    ))}
                </fieldset>

                <label htmlFor="namespace">Namespace</label>
                <input type="text" id="namespace" name="namespace" />

                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" />

                <label htmlFor="value">Value</label>
                <input type="text" id="value" name="value" />

                <input type="submit" value="Encrypt" />
            </Form>

            {actionData ? (
                <code
                    style={{
                        display: 'block',
                        overflowWrap: 'anywhere',
                        whiteSpace: 'unset',
                    }}
                >
                    {actionData}
                </code>
            ) : null}
        </main>
    );
}
