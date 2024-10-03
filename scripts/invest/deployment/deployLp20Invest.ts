import { toNano } from '@ton/core';
import { Lp20Invest } from '../wrappers/Lp20Invest';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const lp20Invest = provider.open(Lp20Invest.createFromConfig({}, await compile('Lp20Invest')));

    await lp20Invest.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(lp20Invest.address);

    // run methods on `lp20Invest`
}
