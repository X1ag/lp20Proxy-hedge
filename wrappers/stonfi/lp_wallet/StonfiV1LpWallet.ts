import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type StonfiV1LpWalletConfig = {};

export function stonfiV1LpWalletConfigToCell(config: StonfiV1LpWalletConfig): Cell {
    return beginCell().endCell();
}

export class StonfiV1LpWallet implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new StonfiV1LpWallet(address);
    }

    static createFromConfig(config: StonfiV1LpWalletConfig, code: Cell, workchain = 0) {
        const data = stonfiV1LpWalletConfigToCell(config);
        const init = { code, data };
        return new StonfiV1LpWallet(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
