import { Address, beginCell, Cell, Slice, toNano } from '@ton/core';
import { Lp20Vault } from '../../../../wrappers/lp20proxy/vault/Lp20Vault';
import { compile, NetworkProvider } from '@ton/blueprint';
import { LP20_COLLECTION_ADDRESS, STONFI_POOL_ADDRESS } from '../../../cosnt/const';

function pack_jetton_lp_wallet_data(balance: bigint, owner_address: Address, jetton_master_address: Address, jetton_wallet_code: Cell): Cell {
    return beginCell()
      .storeCoins(balance)
      .storeAddress(owner_address)
      .storeAddress(jetton_master_address)
      .storeRef(jetton_wallet_code)
    .endCell();
  }
  
  function calculate_jetton_lp_wallet_state_init(owner_address: Address, jetton_master_address: Address, jetton_wallet_code: Cell): Cell {
    return beginCell()
      .storeUint(0, 2)

      .storeUint(1, 1)
      .storeRef(jetton_wallet_code)

      .storeUint(1, 1)
      .storeRef(pack_jetton_lp_wallet_data(0n, owner_address, jetton_master_address, jetton_wallet_code))

      .storeUint(0, 1)
    .endCell();
  }
  
  function calculate_jetton_lp_wallet_address(state_init: Cell): Address {
    return beginCell().storeUint(4, 3)
      .storeInt(0, 8)
      .storeUint(BigInt(state_init.hash().toString("hex")), 256)
    .endCell().beginParse().loadAddress();
  }
  
  function calculate_user_jetton_lp_wallet_address(owner_address: Address, jetton_master_address: Address, jetton_wallet_code: Cell): Address {
    return calculate_jetton_lp_wallet_address(calculate_jetton_lp_wallet_state_init(owner_address, jetton_master_address, jetton_wallet_code));
  }
  
export async function run(provider: NetworkProvider) {

    const config = {
        init: 0,
        lp_token_balance: 0n,
        collection_addr: Address.parse(LP20_COLLECTION_ADDRESS),
        pool_addr: Address.parse(STONFI_POOL_ADDRESS),
        user_proxy_acc_code: await compile("lp20proxy/account/Lp20ProxyAccount.compile")
    }

    const lp20Vault = provider.open(Lp20Vault.createFromConfig(config, await compile('stonfi/vault/Lp20Vault')));
    const vaultAddress: Address = Lp20Vault.createAddressFromConfig(config, await compile('stonfi/vault/Lp20Vault'))

    await lp20Vault.sendDeploy(provider.sender(), {
        value: toNano('0.05'),
        wallet_addres: calculate_user_jetton_lp_wallet_address(vaultAddress, Address.parse(STONFI_POOL_ADDRESS), await compile("stonfi/lp_wallet/StonfiV1LpWallet"))
    });

    await provider.waitForDeploy(lp20Vault.address);
}
