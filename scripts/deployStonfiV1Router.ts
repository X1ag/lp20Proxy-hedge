import { toNano } from '@ton/core';
import { StonfiV1Router } from '../wrappers/StonfiV1Router';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const stonfiV1Router = provider.open(StonfiV1Router.createFromConfig({}, await compile('StonfiV1Router')));

    await stonfiV1Router.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(stonfiV1Router.address);

    // run methods on `stonfiV1Router`
}
