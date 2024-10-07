import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/src/lp20proxy/invest/lp20_invest.fc'],
};
