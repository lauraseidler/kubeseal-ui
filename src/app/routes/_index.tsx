import { ActionFunction } from '@remix-run/node';
import {
    Form,
    useActionData,
    useLoaderData,
    useSearchParams,
} from '@remix-run/react';
import { Fragment, useState } from 'react';
import invariant from 'tiny-invariant';
import { getEnvironments } from '~/environment';
import { sealSecret } from '~/kubeseal';

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const cluster = formData.get('cluster');
    const scope = formData.get('scope');
    const namespace = formData.get('namespace');
    const name = formData.get('name');
    const value = formData.get('value');

    invariant(
        typeof cluster === 'string' && !!cluster,
        'Please select a cluster',
    );

    invariant(typeof scope === 'string' && !!scope, 'Please select a scope');

    invariant(
        (typeof namespace === 'string' && !!namespace) ||
            (namespace === null && scope !== 'strict'),
        'Please provide the secret namespace',
    );

    invariant(
        (typeof name === 'string' && !!name) ||
            (name === null && scope !== 'strict'),
        'Please provide the secret name',
    );

    invariant(
        typeof value === 'string' && !!value,
        'Please provide the secret value',
    );

    return sealSecret({ cluster, scope, namespace, name, value });
};

export const loader = async () => {
    return getEnvironments();
};

export default function Index() {
    const environments = useLoaderData<Awaited<ReturnType<typeof loader>>>();

    const [searchParams] = useSearchParams();

    const actionData = useActionData();

    const [isClusterWide, setIsClusterWide] = useState(
        searchParams.get('scope') === 'cluster-wide',
    );

    return (
        <main style={{ padding: '1rem' }}>
            <h1>kubeseal UI</h1>

            <Form method="post">
                <fieldset>
                    <legend>Cluster</legend>

                    {environments
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((environment) => (
                            <Fragment key={environment.name}>
                                <input
                                    type="radio"
                                    name="cluster"
                                    value={environment.name}
                                    id={`cluster-${environment.name}`}
                                    defaultChecked={
                                        searchParams.get('cluster') ===
                                        environment.name
                                    }
                                    required
                                />

                                <label
                                    className="label-inline"
                                    htmlFor={`cluster-${environment.name}`}
                                >
                                    {environment.name}
                                </label>
                                <br />
                            </Fragment>
                        ))}
                </fieldset>

                <fieldset>
                    <legend>Scope</legend>

                    <input
                        type="radio"
                        name="scope"
                        value="strict"
                        id="scope-strict"
                        onChange={(e) => setIsClusterWide(!e.target.checked)}
                        defaultChecked={!isClusterWide}
                        required
                    />

                    <label className="label-inline" htmlFor="scope-strict">
                        default (strict)
                    </label>
                    <br />

                    <input
                        type="radio"
                        name="scope"
                        value="cluster-wide"
                        id="scope-cluster-wide"
                        onChange={(e) => setIsClusterWide(e.target.checked)}
                        defaultChecked={isClusterWide}
                        required
                    />

                    <label
                        className="label-inline"
                        htmlFor="scope-cluster-wide"
                    >
                        cluster-wide
                    </label>
                    <br />
                </fieldset>

                {!isClusterWide && (
                    <Fragment>
                        <label htmlFor="namespace">Namespace</label>
                        <input
                            type="text"
                            id="namespace"
                            name="namespace"
                            defaultValue={searchParams.get('namespace') || ''}
                            required
                        />
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={searchParams.get('name') || ''}
                            required
                        />
                    </Fragment>
                )}

                <label htmlFor="value">Value</label>
                <input type="text" id="value" name="value" required />

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
