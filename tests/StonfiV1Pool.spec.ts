import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { StonfiV1Pool } from '../wrappers/StonfiV1Pool';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('StonfiV1Pool', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('StonfiV1Pool');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let stonfiV1Pool: SandboxContract<StonfiV1Pool>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        stonfiV1Pool = blockchain.openContract(StonfiV1Pool.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await stonfiV1Pool.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: stonfiV1Pool.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and stonfiV1Pool are ready to use
    });
});
