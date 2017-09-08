import { Injectable } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs/Observable';
import { Money } from '../org.acme.usetech';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class TransactionsService {

	private NAMESPACE: string = 'Transaction';

	constructor(private dataService: DataService<Money>) {
	};

	public getAll(): Observable<Money[]> {
		return this.dataService.getAll(this.NAMESPACE);
	}

	public getAsset(id: any): Observable<Money> {
		return this.dataService.getSingle(this.NAMESPACE, id);
	}

	public addAsset(itemToAdd: any): Observable<Money> {
		return this.dataService.add(this.NAMESPACE, itemToAdd);
	}

	public updateAsset(id: any, itemToUpdate: any): Observable<Money> {
		return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
	}

	public deleteAsset(id: any): Observable<Money> {
		return this.dataService.delete(this.NAMESPACE, id);
	}

}
