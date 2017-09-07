import {ISerializable} from '../Core/core';

export interface IWallet {
	id: number,
	is_deleted: boolean,
}

export class Wallet implements ISerializable<IWallet> {
	id: number;
	is_deleted: boolean = false;

	constructor(data = null) {
		data && this.deserialize(data);
	}

	deserialize(structure: IWallet) {
		this.id = structure.id;
		this.is_deleted = structure.is_deleted;
	}

	serialize() {
		return {
			id: this.id,
			is_deleted: this.is_deleted,
		};
	}
}
