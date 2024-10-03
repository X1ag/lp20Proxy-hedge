import { toNano } from '@ton/core';
import { Lp20Vault } from '../wrappers/Lp20Vault';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const lp20Vault = provider.open(Lp20Vault.createFromConfig({}, await compile('Lp20Vault')));

    await lp20Vault.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(lp20Vault.address);

    // run methods on `lp20Vault`
}
