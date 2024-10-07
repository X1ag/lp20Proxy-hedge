import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/src/lp20proxy/collection/lp20_proxy_collection.fc'],
};
