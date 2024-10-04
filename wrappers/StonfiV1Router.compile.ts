import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/src/stonfi/stonfi_v1_router/stonfi_v1_router.fc'],
};
