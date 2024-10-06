import { toNano } from '@ton/core';
import { Lp20ProxyAccount } from '../wrappers/Lp20ProxyAccount';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const lp20ProxyAccount = provider.open(Lp20ProxyAccount.createFromConfig({}, await compile('Lp20ProxyAccount')));

    await lp20ProxyAccount.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(lp20ProxyAccount.address);

    // run methods on `lp20ProxyAccount`
}
