import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';


export type Lp20ProxyRoyaltyParams = {
    royaltyFactor: number;
    royaltyBase: number;
    royaltyAddress: Address;
};

export type Lp20ProxyCollectionConfig = {
    admin_addr: Address;
    next_lp20proxy_index: bigint;
    lp20proxy_content: Cell;
    lp20proxy_item_code: Cell;
    lp20proxy_royalty_params: Lp20ProxyRoyaltyParams;
    pool_addr: Address;
    stonfi_router_addr: Address;
    invest_addr: Address;
    proxy_acc_code: Cell;
    vault_addr: Address;
    tokenA_master: Address;
    tokenB_master: Address;
    tokenA_wallet_code: Cell;
    tokenB_wallet_code: Cell;
    lp_jetton_wallet_code: Cell;
    nft_item_content: Cell;
};

export function lp20ProxyCollectionConfigToCell(config: Lp20ProxyCollectionConfig): Cell {
    return (
        beginCell()
            .storeAddress(config.admin_addr)
            .storeUint(config.next_lp20proxy_index, 64)
            .storeRef(config.lp20proxy_content)
            .storeRef(config.lp20proxy_item_code)
            .storeRef(
                beginCell()
                    .storeUint(config.lp20proxy_royalty_params.royaltyFactor, 16)
                    .storeUint(config.lp20proxy_royalty_params.royaltyBase, 16)
                    .storeAddress(config.lp20proxy_royalty_params.royaltyAddress)
                .endCell()
            )
            .storeAddress(config.pool_addr)
            .storeAddress(config.vault_addr)
            .storeRef(
                beginCell()
                    .storeAddress(config.stonfi_router_addr)
                    .storeRef(config.proxy_acc_code)

                    .storeAddress(config.tokenA_master)
                    .storeAddress(config.tokenB_master)
                    .storeRef(config.tokenA_wallet_code)
                    .storeRef(config.tokenB_wallet_code)
                    .storeRef(
                        beginCell()
                            .storeAddress(config.invest_addr)
                            .storeRef(config.lp_jetton_wallet_code)
                            .storeRef(config.nft_item_content)
                        .endCell()
                    )
                .endCell()
            )
        .endCell()
    );
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

    async sendMagic(provider: ContractProvider, via: Sender, 
        options: {
            value: bigint;
            queryId: bigint;
            mode: number;
            payload: Cell;
        }
    ) {
        await provider.internal(via, {
            value: options.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: 
                beginCell()
                    .storeUint(0xaaab, 32)
                    .storeUint(options.queryId, 64)
                    .storeRef(
                        beginCell()
                            .storeUint(options.mode, 8)
                            .storeRef(options.payload)
                        .endCell()
                    )
                .endCell(),
        });
    }

    async sendTestItemMint(provider: ContractProvider, via: Sender, value: bigint, userAddress: Address) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: 
                beginCell()
                    .storeUint(0x34, 32)
                    .storeUint(111, 64)
                    .storeAddress(userAddress)
                .endCell(),
        });
    }

}
