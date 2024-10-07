import * as dotenv from 'dotenv';
import { Address, Cell, toNano } from '@ton/core';
import { Lp20ProxyCollection } from '../../../../wrappers/lp20proxy/collection/Lp20ProxyCollection';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildCollectionContentCell } from '../helpers/metadata';
import { LP20_INVEST_ADDRESS, LP20_VAULT_ADDRESS, STONFI_POOL_ADDRESS, STONFI_ROUTER_ADDRESS, TOKEN_ADDRESS_A, TOKEN_ADDRESS_B } from '../../../cosnt/const';
import { TonClient } from '@ton/ton';

// cover_image --> https://colorfully.eu/wp-content/uploads/2012/06/the-matrix-choose-red-pill-blue-pill-facebook-cover.jpg
// image --> https://facts.net/wp-content/uploads/2023/07/number-20-on-the-calendar.jpeg

dotenv.config()

const ENDPOINT = process.env.ENDPOINT
const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY

export async function calculateJettonWalletCodesWithClient(minterAddress: string): Promise<Cell> {
    
    const client = new TonClient({
        endpoint: ENDPOINT as string,
        apiKey: TONCENTER_API_KEY
    });

    const response = await client.runMethod(Address.parse(minterAddress), "get_jetton_data", [])

    response.stack.readNumber(), response.stack.readNumber(), response.stack.readAddress(), response.stack.readCell()
    return response.stack.readCell();
}

export async function run(provider: NetworkProvider) {
    const lp20ProxyCollection = provider.open(Lp20ProxyCollection.createFromConfig({
        admin_addr: provider.sender().address as Address,
        next_lp20proxy_index: 0n,
        lp20proxy_content: buildCollectionContentCell({
            name: "Lp20Proxy protocol",
            description: "Lp20Proxy protocol by TAIGA Labs --> The choice is yours",
            image: "https://facts.net/wp-content/uploads/2023/07/number-20-on-the-calendar.jpeg",
            cover_image: "https://colorfully.eu/wp-content/uploads/2012/06/the-matrix-choose-red-pill-blue-pill-facebook-cover.jpg"
        }),
        lp20proxy_item_code: await compile("lp20proxy/item/Lp20ProxyItem"),
        lp20proxy_royalty_params: {
            royaltyFactor: 1,
            royaltyBase: 100,
            royaltyAddress: provider.sender().address as Address,
        },
        pool_addr: Address.parse(STONFI_POOL_ADDRESS),
        stonfi_router_addr: Address.parse(STONFI_ROUTER_ADDRESS),
        invest_addr: Address.parse(LP20_INVEST_ADDRESS),
        proxy_acc_code: await compile("lp20proxy/account/Lp20ProxyAccount.compile"),
        vault_addr: Address.parse(LP20_VAULT_ADDRESS),
        tokenA_master: Address.parse(TOKEN_ADDRESS_A),
        tokenB_master: Address.parse(TOKEN_ADDRESS_B),
        tokenA_wallet_code: await calculateJettonWalletCodesWithClient(TOKEN_ADDRESS_A),
        tokenB_wallet_code: await calculateJettonWalletCodesWithClient(TOKEN_ADDRESS_B),
    }, await compile('lp20proxy/collection/Lp20ProxyCollection')));

    await lp20ProxyCollection.sendDeploy(provider.sender(), toNano('0.02'));
    await provider.waitForDeploy(lp20ProxyCollection.address);
}
