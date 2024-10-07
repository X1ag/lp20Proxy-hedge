import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type StonfiV1LpAccountConfig = {};

export function stonfiV1LpAccountConfigToCell(config: StonfiV1LpAccountConfig): Cell {
    return beginCell().endCell();
}

export class StonfiV1LpAccount implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new StonfiV1LpAccount(address);
    }

    static createFromConfig(config: StonfiV1LpAccountConfig, code: Cell, workchain = 0) {
        const data = stonfiV1LpAccountConfigToCell(config);
        const init = { code, data };
        return new StonfiV1LpAccount(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
