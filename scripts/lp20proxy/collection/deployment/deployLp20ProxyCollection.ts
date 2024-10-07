import { toNano } from '@ton/core';
import { Lp20ProxyCollection } from '../../../../wrappers/lp20proxy/collection/Lp20ProxyCollection';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const lp20ProxyCollection = provider.open(Lp20ProxyCollection.createFromConfig({}, await compile('Lp20ProxyCollection')));

    await lp20ProxyCollection.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(lp20ProxyCollection.address);

    // run methods on `lp20ProxyCollection`
}
