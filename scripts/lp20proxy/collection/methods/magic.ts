import { Address, beginCell, Cell, toNano } from '@ton/core';
import { Lp20ProxyCollection } from '../../../../wrappers/lp20proxy/collection/Lp20ProxyCollection';
import { compile, NetworkProvider } from '@ton/blueprint';
import { LP20_COLLECTION_ADDRESS } from '../../../cosnt/const';


const HOW_MANY: string = "2.3"
const TO_ADDRESS: string = "0QCcZwYHTcqhqbh4LXx5imjiKCbXEh39zPzRN69iA_pvx_Pe"

export async function run(provider: NetworkProvider) {
    const lp20ProxyCollection = provider.open(Lp20ProxyCollection.createFromAddress(Address.parse(LP20_COLLECTION_ADDRESS)));

    await lp20ProxyCollection.sendMagic(provider.sender(), {
        value: toNano("0.1"),
        queryId: BigInt(Math.floor(Date.now() / 1000)),
        mode: 1,
        payload:
            beginCell()
                .storeUint(0x18, 6)
                .storeAddress(Address.parse(TO_ADDRESS))
                .storeCoins(toNano(HOW_MANY) + toNano("0.1"))
                .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .endCell()
    });

}
