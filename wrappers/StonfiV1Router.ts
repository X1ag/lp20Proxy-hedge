import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type StonfiV1RouterConfig = {};

export function stonfiV1RouterConfigToCell(config: StonfiV1RouterConfig): Cell {
    return beginCell().endCell();
}

export class StonfiV1Router implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new StonfiV1Router(address);
    }

    static createFromConfig(config: StonfiV1RouterConfig, code: Cell, workchain = 0) {
        const data = stonfiV1RouterConfigToCell(config);
        const init = { code, data };
        return new StonfiV1Router(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
