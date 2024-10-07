import { Address, beginCell, toNano } from '@ton/core';
import { StonfiV1Router } from '../../../../wrappers/stonfi/router/StonfiV1Router';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const stonfiV1Router = provider.open(StonfiV1Router.createFromConfig({
        is_locked: 0,
        admin_address: provider.sender().address as Address, 
        jetton_lp_wallet_code: await compile("stonfi/lp_wallet/StonfiV1LpWallet"),
        pool_code: await compile("stonfi/pool/StonfiV1Pool"),
        lp_account_code: await compile("stonfi/lp_acc/StonfiV1LpAccount"),
        temp_upgrade: beginCell().endCell()
    }, await compile('stonfi/router/StonfiV1Router')));
    await stonfiV1Router.sendDeploy(provider.sender(), toNano('0.02'));
    await provider.waitForDeploy(stonfiV1Router.address);
}
