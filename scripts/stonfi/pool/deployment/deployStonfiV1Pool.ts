import { toNano } from '@ton/core';
import { StonfiV1Pool } from '../../../../wrappers/StonfiV1Pool';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const stonfiV1Pool = provider.open(StonfiV1Pool.createFromConfig({}, await compile('StonfiV1Pool')));

    await stonfiV1Pool.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(stonfiV1Pool.address);

    // run methods on `stonfiV1Pool`
}
