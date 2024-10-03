import { toNano } from '@ton/core';
import { Lp20ProxyItem } from '../wrappers/Lp20ProxyItem';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const lp20ProxyItem = provider.open(Lp20ProxyItem.createFromConfig({}, await compile('Lp20ProxyItem')));

    await lp20ProxyItem.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(lp20ProxyItem.address);

    // run methods on `lp20ProxyItem`
}
