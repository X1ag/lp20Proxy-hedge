import * as dotenv from 'dotenv';
import { mnemonicToWalletKey } from '@ton/crypto';
import { Address, beginCell, internal, MessageRelaxed, toNano, TonClient, TupleItemSlice, WalletContractV4 } from '@ton/ton';
import { LP20_VAULT_ADDRESS, STONFI_POOL_ADDRESS } from '../scripts/cosnt/const';

dotenv.config()

const ENDPOINT = process.env.ENDPOINT as string
const WALLET_MNEMONIC = process.env.WALLET_MNEMONIC as string
const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY as string


async function getLpJettonWallet(minterAddress: Address, ownerAddress: Address, client: TonClient): Promise<string> {
    const response = await client.runMethod(minterAddress, "get_wallet_address", [
        {
            type: 'slice',
            cell: 
                beginCell()
                    .storeAddress(ownerAddress)
                .endCell()
        } as TupleItemSlice
    ])
    return response.stack.readAddress().toString();
}

async function add_lp_to_vaults(coins_to_add: bigint) {
    const client = new TonClient({
        endpoint: ENDPOINT,
        apiKey: TONCENTER_API_KEY
    });

    const key = await mnemonicToWalletKey(WALLET_MNEMONIC.split(" "));
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    const my_address = wallet.address;

    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();
    console.log("[SEQNO] -->", seqno);

    const myLpJettonWalletAddres: string = await getLpJettonWallet(
        Address.parse(STONFI_POOL_ADDRESS),
        my_address,
        client
    )

    const message: MessageRelaxed = 
        internal({
            to: myLpJettonWalletAddres,
            value: toNano("0.05"),
            body: 
            beginCell()
                .storeUint(0xf8a7ea5, 32)
                .storeUint(Math.floor(Date.now() / 1000), 64)
                .storeCoins(coins_to_add) // full price
                .storeAddress(Address.parse(LP20_VAULT_ADDRESS))
                .storeUint(0, 2) // response address -- null
                .storeUint(0, 1) // null custom payload
                .storeCoins(toNano("0.01"))
                .storeUint(1, 1)
                .storeRef(
                    beginCell()
                        .storeUint(0x214df, 32)
                    .endCell()
                )
            .endCell(),
        });
    
    await walletContract.sendTransfer({
        secretKey: key.secretKey,
        seqno: seqno,
        messages: [
            message,
        ]   
    });

    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
        console.log("waiting for transaction to confirm...");
        currentSeqno = await walletContract.getSeqno();
    }
    console.log("transaction confirmed!")
}

async function main() {
    add_lp_to_vaults(
        toNano(0.005)
    )
}

main();