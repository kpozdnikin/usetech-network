import {ISerializable} from '../Core/core';

export interface IMoney {
	moneyId: number,
	owner: string,
	amount: number,
}

export class Money implements ISerializable<IMoney> {
	moneyId: number;
	owner: string;
	amount: number;

	constructor(data = null) {
		data && this.deserialize(data);
	}

	deserialize(structure: IMoney) {
		this.moneyId = structure.moneyId;
		this.owner = structure.owner;
		this.amount = structure.amount;
	}

	serialize() {
		return {
			moneyId: this.moneyId,
			owner: this.owner,
			amount: this.amount,
		};
	}
}
