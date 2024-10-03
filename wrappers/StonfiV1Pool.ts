import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type StonfiV1PoolConfig = {};

export function stonfiV1PoolConfigToCell(config: StonfiV1PoolConfig): Cell {
    return beginCell().endCell();
}

export class StonfiV1Pool implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new StonfiV1Pool(address);
    }

    static createFromConfig(config: StonfiV1PoolConfig, code: Cell, workchain = 0) {
        const data = stonfiV1PoolConfigToCell(config);
        const init = { code, data };
        return new StonfiV1Pool(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
