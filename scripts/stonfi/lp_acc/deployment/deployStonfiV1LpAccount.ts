import { toNano } from '@ton/core';
import { StonfiV1LpAccount } from '../../../../wrappers/StonfiV1LpAccount';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const stonfiV1LpAccount = provider.open(StonfiV1LpAccount.createFromConfig({}, await compile('StonfiV1LpAccount')));

    await stonfiV1LpAccount.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(stonfiV1LpAccount.address);

    // run methods on `stonfiV1LpAccount`
}
