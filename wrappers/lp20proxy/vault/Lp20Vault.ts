import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type Lp20VaultConfig = {
    init: number;
    lp_token_balance: bigint;
    pool_addr: Address;
    user_proxy_acc_code: Cell;
};

export function lp20VaultConfigToCell(config: Lp20VaultConfig): Cell {
    return (
        beginCell()
            .storeCoins(config.lp_token_balance)
            .storeAddress(config.pool_addr)
            .storeRef(config.user_proxy_acc_code)
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

    async sendDeploy(provider: ContractProvider, via: Sender, 
        options: {
            value: bigint;
            wallet_addres: Address;
        }
    ) {
        await provider.internal(via, {
            value: options.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: 
                beginCell()
                    .storeUint(0x2134, 32)
                    .storeAddress(options.wallet_addres)
                .endCell(),
        });
    }
}
