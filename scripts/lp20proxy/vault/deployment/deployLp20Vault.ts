import { Address, beginCell, Cell, Slice, toNano } from '@ton/core';
import { Lp20Vault } from '../../../../wrappers/lp20proxy/vault/Lp20Vault';
import { compile, NetworkProvider } from '@ton/blueprint';
import { LP20_COLLECTION_ADDRESS, STONFI_POOL_ADDRESS } from '../../../cosnt/const';
  
export async function run(provider: NetworkProvider) {
    const lp20Vault = provider.open(Lp20Vault.createFromConfig({
        lp_token_balance: 0n,
        pool_addr: Address.parse(STONFI_POOL_ADDRESS),
        admin_address: provider.sender().address as Address,
        user_proxy_acc_code: await compile("lp20proxy/account/Lp20ProxyAccount"),
        lp_wallet_code: await compile("stonfi/lp_wallet/StonfiV1LpWallet")
    }, await compile('lp20proxy/vault/Lp20Vault')));

    await lp20Vault.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(lp20Vault.address);
}

