import { Address, toNano } from '@ton/core';
import { Lp20Invest } from '../../../../wrappers/lp20proxy/invest/Lp20Invest';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const lp20Invest = provider.open(Lp20Invest.createFromConfig({
        admin_addr: provider.sender().address as Address
    }, await compile('stonfi/investLp20Invest')));

    await lp20Invest.sendDeploy(provider.sender(), toNano('0.02'));
    await provider.waitForDeploy(lp20Invest.address);
}
