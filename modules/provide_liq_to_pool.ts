import { mnemonicToWalletKey } from '@ton/crypto';
import { Address, beginCell, Cell, internal, MessageRelaxed, toNano, TonClient, TupleItemSlice, WalletContractV4 } from '@ton/ton';
import * as dotenv from 'dotenv';
import { STONFI_ROUTER_ADDRESS, TOKEN_ADDRESS_A, TOKEN_ADDRESS_B } from '../scripts/cosnt/const';

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


function createProvideLpPayload(routerWalletAddr: Address): Cell {
    return (
        beginCell()
            .storeUint(0xfcf9e58f, 32)
            .storeAddress(routerWalletAddr)
            .storeCoins(1) // min_out
            .storeUint(0, 1) // null addi payload
        .endCell()
    )
            
}

function createProvideLpMessage(qID: bigint, jettonAmount: bigint, fwdAmount: number, tonAmpunt: number, provideLpPyaload: Cell, myJwAddress: Address): MessageRelaxed {
    return (
        internal({
        to: myJwAddress,
        value: toNano(tonAmpunt),
        body: 
        beginCell()
            .storeUint(0xf8a7ea5, 32)
            .storeUint(qID, 64)
            .storeCoins(jettonAmount) 
            .storeAddress(Address.parse(STONFI_ROUTER_ADDRESS))
            .storeUint(0, 2) // response address -- null
            .storeUint(0, 1) // null custom payload
            .storeCoins(toNano(fwdAmount))
            .storeUint(1, 1)
            .storeRef(provideLpPyaload)
        .endCell(),
        })
    )
}

async function provide_liq(assetA_amount: bigint, assetB_amount: bigint) {

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

    // const myLpJettonWalletAddres: string = await getJettonWallet(
    //     Address.parse(STONFI_POOL_ADDRESS),
    //     my_address,
    //     client
    // )

    const routerWalletA = await getJettonWallet(
        Address.parse(TOKEN_ADDRESS_A),
        Address.parse(STONFI_ROUTER_ADDRESS),
        client
    )
    const routerWalletB = await getJettonWallet(
        Address.parse(TOKEN_ADDRESS_B),
        Address.parse(STONFI_ROUTER_ADDRESS),
        client
    )

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

    const payloadA = createProvideLpPayload(Address.parse(routerWalletB))
    const payloadB = createProvideLpPayload(Address.parse(routerWalletA))

    const qID_A = BigInt(Math.floor(Date.now() / 1000))
    const qID_B = BigInt(Math.floor(Date.now() / 1000) + 12345567)

    const msgA = createProvideLpMessage(qID_A, assetA_amount, 0.24, 0.3, payloadA, Address.parse(myWalletA))
    const msgB = createProvideLpMessage(qID_B, assetB_amount, 0.24, 0.3, payloadB, Address.parse(myWalletB))

    const messages: MessageRelaxed[] = [
        msgA,
        msgB
    ];

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
    provide_liq(
        30_000n * 10n**6n,
        3_000n * 10n**6n
    )
}

main();