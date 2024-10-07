import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/src/lp20proxy/item/lp20_proxy_item.fc'],
};
