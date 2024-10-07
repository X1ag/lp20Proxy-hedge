import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type Lp20VaultConfig = {};

export function lp20VaultConfigToCell(config: Lp20VaultConfig): Cell {
    return beginCell().endCell();
}

export class Lp20Vault implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Lp20Vault(address);
    }

    static createFromConfig(config: Lp20VaultConfig, code: Cell, workchain = 0) {
        const data = lp20VaultConfigToCell(config);
        const init = { code, data };
        return new Lp20Vault(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
