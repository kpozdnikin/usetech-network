import {ISerializable} from '../Core/core';

export interface IWallet {
	walletId: number,
	money: string,
}

export class Wallet implements ISerializable<IWallet> {
	walletId: number;
	money: string;

	constructor(data = null) {
		data && this.deserialize(data);
	}

	deserialize(structure: IWallet) {
		this.walletId = structure.walletId;
		this.money = structure.money;
	}

	serialize() {
		return {
			walletId: this.walletId,
			money: this.money,
		};
	}
}
