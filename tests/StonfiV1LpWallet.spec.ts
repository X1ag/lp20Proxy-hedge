import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { StonfiV1LpWallet } from '../wrappers/StonfiV1LpWallet';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('StonfiV1LpWallet', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('StonfiV1LpWallet');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let stonfiV1LpWallet: SandboxContract<StonfiV1LpWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        stonfiV1LpWallet = blockchain.openContract(StonfiV1LpWallet.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await stonfiV1LpWallet.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: stonfiV1LpWallet.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and stonfiV1LpWallet are ready to use
    });
});
