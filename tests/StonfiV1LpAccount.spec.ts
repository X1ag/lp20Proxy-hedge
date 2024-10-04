import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { StonfiV1LpAccount } from '../wrappers/StonfiV1LpAccount';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('StonfiV1LpAccount', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('StonfiV1LpAccount');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let stonfiV1LpAccount: SandboxContract<StonfiV1LpAccount>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        stonfiV1LpAccount = blockchain.openContract(StonfiV1LpAccount.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await stonfiV1LpAccount.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: stonfiV1LpAccount.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and stonfiV1LpAccount are ready to use
    });
});
