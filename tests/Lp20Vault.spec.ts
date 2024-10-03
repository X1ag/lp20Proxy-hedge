import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Lp20Vault } from '../wrappers/Lp20Vault';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Lp20Vault', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Lp20Vault');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let lp20Vault: SandboxContract<Lp20Vault>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        lp20Vault = blockchain.openContract(Lp20Vault.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await lp20Vault.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: lp20Vault.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and lp20Vault are ready to use
    });
});
