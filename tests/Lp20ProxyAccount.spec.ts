import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Lp20ProxyAccount } from '../wrappers/lp20proxy/account/Lp20ProxyAccount';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Lp20ProxyAccount', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Lp20ProxyAccount');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let lp20ProxyAccount: SandboxContract<Lp20ProxyAccount>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        lp20ProxyAccount = blockchain.openContract(Lp20ProxyAccount.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await lp20ProxyAccount.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: lp20ProxyAccount.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and lp20ProxyAccount are ready to use
    });
});
