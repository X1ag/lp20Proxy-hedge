import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type Lp20ProxyCollectionConfig = {};

export function lp20ProxyCollectionConfigToCell(config: Lp20ProxyCollectionConfig): Cell {
    return beginCell().endCell();
}

export class Lp20ProxyCollection implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Lp20ProxyCollection(address);
    }

    static createFromConfig(config: Lp20ProxyCollectionConfig, code: Cell, workchain = 0) {
        const data = lp20ProxyCollectionConfigToCell(config);
        const init = { code, data };
        return new Lp20ProxyCollection(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
