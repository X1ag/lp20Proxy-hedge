import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { StonfiV1Router } from '../wrappers/StonfiV1Router';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('StonfiV1Router', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('StonfiV1Router');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let stonfiV1Router: SandboxContract<StonfiV1Router>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        stonfiV1Router = blockchain.openContract(StonfiV1Router.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await stonfiV1Router.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: stonfiV1Router.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and stonfiV1Router are ready to use
    });
});
