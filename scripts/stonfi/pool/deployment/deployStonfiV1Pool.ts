import { Address, toNano } from '@ton/core';
import { StonfiV1Pool } from '../../../../wrappers/stonfi/pool/StonfiV1Pool';
import { compile, NetworkProvider } from '@ton/blueprint';
import { STONFI_ROUTER_ADDRESS, TOKEN_ADDRESS_A, TOKEN_ADDRESS_B } from '../../../cosnt/const';

export async function run(provider: NetworkProvider) {
    const stonfiV1Pool = provider.open(StonfiV1Pool.createFromConfig({
        router_address: Address.parse(STONFI_ROUTER_ADDRESS),
        lp_fee: 0,
        protocol_fee: 0,
        ref_fee: 0,
        token0_address: Address.parse(TOKEN_ADDRESS_A),
        token1_address: Address.parse(TOKEN_ADDRESS_B),
        total_supply_lp: 0n,
        collected_token0_protocol_fee: 0n,
        collected_token1_protocol_fee: 0n,
        protocol_fee_address: provider.sender().address as Address,
        reserve0: 0n,
        reserve1: 0n,
        jetton_lp_wallet_code: await compile("stonfi/lp_wallet/StonfiV1LpWallet"),
        lp_account_code: await compile("stonfi/lp_acc/StonfiV1LpAccount")
    }, await compile('stonfi/pool/StonfiV1Pool')));

    await stonfiV1Pool.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(stonfiV1Pool.address);

    // run methods on `stonfiV1Pool`
}
