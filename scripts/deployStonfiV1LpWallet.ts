import { toNano } from '@ton/core';
import { StonfiV1LpWallet } from '../wrappers/StonfiV1LpWallet';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const stonfiV1LpWallet = provider.open(StonfiV1LpWallet.createFromConfig({}, await compile('StonfiV1LpWallet')));

    await stonfiV1LpWallet.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(stonfiV1LpWallet.address);

    // run methods on `stonfiV1LpWallet`
}
