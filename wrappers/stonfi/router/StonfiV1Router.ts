import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type StonfiV1RouterConfig = {
    is_locked: number;
    admin_address: Address; 
    jetton_lp_wallet_code: Cell; 
    pool_code: Cell;
    lp_account_code: Cell; 
    temp_upgrade: Cell;
};

export function stonfiV1RouterConfigToCell(config: StonfiV1RouterConfig): Cell {
    return (
        beginCell()
            .storeUint(config.is_locked, 1)
            .storeAddress(config.admin_address)
            .storeRef(config.jetton_lp_wallet_code)
            .storeRef(config.pool_code)
            .storeRef(config.lp_account_code)
            .storeRef(config.temp_upgrade)
        .endCell()
    );
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
