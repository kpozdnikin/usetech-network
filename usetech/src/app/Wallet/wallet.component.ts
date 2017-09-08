import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from "../services/data.service";
import { Wallet } from "../Wallet/wallet.model";
import { Money } from "../Money/money.model";

@Component({
	selector: 'app-wallet',
	templateUrl: './wallet.component.html',
	styleUrls: ['./wallet.component.css'],
})
export class WalletComponent {
	errorMessage: String;
	allWallets: Wallet[];
	selectedWallet: Wallet;
	allTransactions: Object[];
	transactions: Object[];
	money: Money;

	constructor(@Inject(DataService) private dataServiceWallets: DataService<Wallet>,
							@Inject(DataService) private dataServiceMoney: DataService<Money>){
		this.errorMessage = null;
		this.allWallets = [];
		this.selectedWallet = null;
		this.money = null;
		this.allTransactions = [];
		this.transactions = [];
	}

	ngOnInit() {
		// получаем кошельки
		this.getWallets();
		// получаем транзакции
		this.getTransactions();
	}

	getWallets(): Promise<any> {
		let tempList = [];
		return this.dataServiceWallets.getAll('wallet')
			.toPromise()
			.then((result) => {
				this.errorMessage = null;
				result.forEach(asset => {
					tempList.push(asset);
				});
				this.allWallets = tempList;
				console.log('this.allWallets = ', this.allWallets);
			})
			.catch((error) => {
				if(error == 'Server error'){
					this.errorMessage = "Could not connect to REST server. Please check your configuration details";
				}
				else if(error == '404 - Not Found'){
					this.errorMessage = "404 - Could not find API route. Please check your available APIs."
				}
				else{
					this.errorMessage = error;
				}
			});
	}

	selectWallet(wallet) {
		if (wallet) {
			this.selectedWallet = wallet;
			this.money = null;
			this.getWalletMoney(this.selectedWallet.money);
			console.log('this.selectedWallet = ', this.selectedWallet);
			this.getWalletTransactions(wallet.walletId);
		} else {
			this.getAllTransactions();
			this.selectedWallet = null;
		}
	}

	getTransactions() {
		return this.dataServiceWallets.getAll('system/transactions')
			.toPromise()
			.then((result) => {
				this.transactions = result;
				this.getAllTransactions();
			})
			.catch((error) => {
				if(error == 'Server error'){
					this.errorMessage = "Could not connect to REST server. Please check your configuration details";
				}
				else if(error == '404 - Not Found'){
					this.errorMessage = "404 - Could not find API route. Please check your available APIs."
				}
				else{
					this.errorMessage = error;
				}
			});
	}

	getAllTransactions() {
		this.allTransactions = this.transactions.filter((transaction) => {
			// если это транзакция нужного типа
			if (transaction['$class'] === 'org.acme.usetech.Transfer' || transaction['$class'] === 'org.acme.usetech.TransferFrom') {
				return transaction;
			}
		});
	}

	getWalletTransactions(walletId) {
		this.allTransactions = this.transactions.filter((transaction) => {
			// если транзакция содержит кошелек - отправитель, или кошелек - получатель с нужным айди и это транзакция нужного типа
			if ((transaction['walletFrom'] && transaction['walletFrom'] === ('resource:org.acme.usetech.Wallet#' + walletId)
				|| transaction['walletTo'] === ('resource:org.acme.usetech.Wallet#' + walletId)) &&
				(transaction['$class'] === 'org.acme.usetech.Transfer' || transaction['$class'] === 'org.acme.usetech.TransferFrom')) {
				return transaction;
			}
		});
	}

	getWalletMoney(money) {
		let moneyId = money.split('#')[1];
		console.log('money = ', money);
		return this.dataServiceMoney.getSingle('money', moneyId)
			.toPromise()
			.then((result) => {
				console.log(result);
				this.money = result;
				console.log('this.money = ', this.money);
			})
			.catch((error) => {
				if(error == 'Server error'){
					this.errorMessage = "Could not connect to REST server. Please check your configuration details";
				}
				else if(error == '404 - Not Found'){
					this.errorMessage = "404 - Could not find API route. Please check your available APIs."
				}
				else{
					this.errorMessage = error;
				}
			});
	}
}
