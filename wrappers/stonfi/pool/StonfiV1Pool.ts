import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type StonfiV1PoolConfig = {
    router_address: Address;
    lp_fee: number;
    protocol_fee: number;
    ref_fee: number;
    token0_address: Address;
    token1_address: Address;
    total_supply_lp: bigint; 
    collected_token0_protocol_fee: bigint;
    collected_token1_protocol_fee: bigint; 
    protocol_fee_address: Address;
    reserve0: bigint;
    reserve1: bigint; 
    jetton_lp_wallet_code: Cell;
    lp_account_code: Cell;
};

export function stonfiV1PoolConfigToCell(config: StonfiV1PoolConfig): Cell {
    return (
        beginCell()
            .storeAddress(config.router_address)
            .storeUint(config.lp_fee, 8)
            .storeUint(config.protocol_fee, 8)
            .storeUint(config.ref_fee, 8)
            .storeAddress(config.token0_address)
            .storeAddress(config.token1_address)
            .storeCoins(config.total_supply_lp)
            .storeRef(
                beginCell()
                    .storeCoins(config.collected_token0_protocol_fee)
                    .storeCoins(config.collected_token1_protocol_fee)
                    .storeAddress(config.protocol_fee_address)
                    .storeCoins(config.reserve0)
                    .storeCoins(config.reserve1)
                .endCell()
            )
            .storeRef(config.jetton_lp_wallet_code)
            .storeRef(config.lp_account_code)
        .endCell()
    );
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
