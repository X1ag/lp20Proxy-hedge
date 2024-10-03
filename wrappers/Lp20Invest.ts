import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type Lp20InvestConfig = {};

export function lp20InvestConfigToCell(config: Lp20InvestConfig): Cell {
    return beginCell().endCell();
}

export class Lp20Invest implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Lp20Invest(address);
    }

    static createFromConfig(config: Lp20InvestConfig, code: Cell, workchain = 0) {
        const data = lp20InvestConfigToCell(config);
        const init = { code, data };
        return new Lp20Invest(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
