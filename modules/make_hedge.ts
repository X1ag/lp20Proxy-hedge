import * as dotenv from 'dotenv';
import { mnemonicToWalletKey } from '@ton/crypto';
import { Address, beginCell, internal, MessageRelaxed, toNano, TonClient, TupleItemSlice, WalletContractV4 } from '@ton/ton';
import { LP20_COLLECTION_ADDRESS, LP20_VAULT_ADDRESS, STONFI_POOL_ADDRESS, TOKEN_ADDRESS_A, TOKEN_ADDRESS_B } from '../scripts/cosnt/const';

dotenv.config()

const ENDPOINT = process.env.ENDPOINT as string
const WALLET_MNEMONIC = process.env.WALLET_MNEMONIC as string
const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY as string


async function getJettonWallet(minterAddress: Address, ownerAddress: Address, client: TonClient): Promise<string> {
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

async function getPoolData(poolAddress: Address, client: TonClient): Promise<[bigint, bigint]> {
    const response = await client.runMethod(poolAddress, "get_pool_data", [])
    return [
        response.stack.readBigNumber(),
        response.stack.readBigNumber()
    ]
}


async function make_hedge(assetA_amount: bigint, assetB_amount: bigint) {
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

    const myWalletA = await getJettonWallet(
        Address.parse(TOKEN_ADDRESS_A),
        my_address,
        client
    )
    const myWalletB = await getJettonWallet(
        Address.parse(TOKEN_ADDRESS_B),
        my_address,
        client
    )

    const collectionWalletA = await getJettonWallet(
        Address.parse(TOKEN_ADDRESS_A),
        Address.parse(LP20_COLLECTION_ADDRESS),
        client
    )
    const collectionWalletB = await getJettonWallet(
        Address.parse(TOKEN_ADDRESS_B),
        Address.parse(LP20_COLLECTION_ADDRESS),
        client
    )

    const qID_A = BigInt(Math.floor(Date.now() / 1000))
    const qID_B = BigInt(Math.floor(Date.now() / 1000) + 12345567)

    const poolReserves: [bigint, bigint] = await getPoolData(Address.parse(STONFI_POOL_ADDRESS), client);
    let ctxPrice: bigint = poolReserves[0] / poolReserves[1]; // take the ratio of A to B
    
    const messages: MessageRelaxed[] = [
        internal({
            to: myWalletA,
            value: toNano("2.2"),
            body: 
            beginCell()
                .storeUint(0xf8a7ea5, 32)
                .storeUint(qID_A, 64)
                .storeCoins(assetA_amount) // full price
                .storeAddress(Address.parse(LP20_COLLECTION_ADDRESS))
                .storeUint(0, 2) // response address -- null
                .storeUint(0, 1) // null custom payload
                .storeCoins(toNano("2"))
                .storeUint(1, 1)
                .storeRef(
                    beginCell()
                        .storeUint(0xd249cf36, 32)
                        .storeAddress(Address.parse(collectionWalletB))
                        .storeCoins(ctxPrice)
                    .endCell()
                )
            .endCell(),
        }),

        internal({
            to: myWalletB,
            value: toNano("2.2"),
            body: 
            beginCell()
                .storeUint(0xf8a7ea5, 32)
                .storeUint(qID_B, 64)
                .storeCoins(assetB_amount) // full price
                .storeAddress(Address.parse(LP20_COLLECTION_ADDRESS))
                .storeUint(0, 2) // response address -- null
                .storeUint(0, 1) // null custom payload
                .storeCoins(toNano("2"))
                .storeUint(1, 1)
                .storeRef(
                    beginCell()
                        .storeUint(0xd249cf36, 32)
                        .storeAddress(Address.parse(collectionWalletA))
                    .endCell()
                )
            .endCell(),
        })
    ]

    await walletContract.sendTransfer({
        secretKey: key.secretKey,
        seqno: seqno,
        messages: messages
    });

    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
        console.log("waiting for transaction to confirm...");
        currentSeqno = await walletContract.getSeqno();
    }
    console.log("transaction confirmed!")
}

async function main() {
    make_hedge(
        10000n * 10n**6n,
        1000n * 10n**6n
    )
}

main();