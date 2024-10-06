import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type Lp20ProxyAccountConfig = {};

export function lp20ProxyAccountConfigToCell(config: Lp20ProxyAccountConfig): Cell {
    return beginCell().endCell();
}

export class Lp20ProxyAccount implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Lp20ProxyAccount(address);
    }

    static createFromConfig(config: Lp20ProxyAccountConfig, code: Cell, workchain = 0) {
        const data = lp20ProxyAccountConfigToCell(config);
        const init = { code, data };
        return new Lp20ProxyAccount(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
