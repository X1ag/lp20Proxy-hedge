import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type Lp20VaultConfig = {
    lp_token_balance: bigint;
    pool_addr: Address;
    admin_address: Address;
    user_proxy_acc_code: Cell;
    lp_wallet_code: Cell;
};

export function lp20VaultConfigToCell(config: Lp20VaultConfig): Cell {
    return (
        beginCell()
            .storeCoins(config.lp_token_balance)
            .storeAddress(config.pool_addr)
            .storeAddress(config.admin_address)
            .storeRef(config.user_proxy_acc_code)
            .storeRef(config.lp_wallet_code)
        .endCell()
    );
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

    static createAddressFromConfig(config: Lp20VaultConfig, code: Cell, workchain = 0) {
        const data = lp20VaultConfigToCell(config);
        const init = { code, data };
        return contractAddress(workchain, init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value: value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
