import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/src/lp20proxy/account/lp20_proxy_account.fc'],
};
