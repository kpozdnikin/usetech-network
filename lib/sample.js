/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Track the transfer of an amount from owner to wallet
 * @param {org.acme.usetech.Transfer} transfer - the trade to be processed
 * @transaction
 */
function transfer(transfer) {
    if (transfer.amount > 0
        && transfer.walletTo.money.amount + transfer.amount > transfer.walletTo.money.amount) {
        transfer.walletTo.money.amount += transfer.amount;
        return getAssetRegistry('org.acme.usetech.Money').then(function (assetRegistry) {
            return assetRegistry.update(transfer.walletTo.money).then(function(){
                var TransactionNotification = getFactory().newEvent('org.acme.usetech', 'TransactionNotification');
                TransactionNotification.walletTo = transfer.walletTo;
                TransactionNotification.amount = transfer.amount;
                emit(TransactionNotification);
            });
        })
            .catch(function (error) {
                var TransferFailNotification = getFactory().newEvent('org.acme.usetech', 'TransferFailNotification');
                TransferFailNotification.walletTo = transfer.walletTo;
                TransferFailNotification.amount = transfer.amount;
                TransferFailNotification.error = 'exception';
                return emit(TransferFailNotification);
            });
    }
    else {
        var transferFailNotification = getFactory().newEvent('org.acme.usetech', 'TransferFailNotification');
        transferNotification.walletTo = transfer.walletTo;
        transferNotification.amount = transfer.amount;
        transferNotification.error = 'Condition is not met';
        return emit(transferFailNotification);
    }
}

/**
 * Track the transfer of an amount from owner to wallet
 * @param {org.acme.usetech.TransferFrom} transfer - the trade to be processed
 * @transaction
 */
function transferFrom(transfer) {
    if (transfer.amount > 0
        && transfer.walletFrom.money.amount > transfer.amount
        && transfer.walletTo.money.amount + transfer.amount > transfer.walletTo.money.amount) {
        var factory = getFactory();
        transfer.walletFrom.money.amount -= transfer.amount;
        transfer.walletTo.money.amount += transfer.amount;
        return getAssetRegistry('org.acme.usetech.Money').then(function (assetRegistry) {
            return assetRegistry.updateAll([transfer.walletFrom.money, transfer.walletTo.money]).then(function() {
                var transferNotification = getFactory().newEvent('org.acme.usetech', 'TransactionFromNotification');
                transferNotification.walletFrom = transfer.walletFrom;
                transferNotification.walletTo = transfer.walletTo;
                transferNotification.amount = transfer.amount;
                emit(transferNotification);
            })
        })
            .catch(function (error) {
                var TransferFromFailNotification = getFactory().newEvent('org.acme.usetech', 'TransferFromFailNotification');
                TransferFromFailNotification.walletFrom = transfer.walletFrom;
                TransferFromFailNotification.walletTo = transfer.walletTo;
                TransferFromFailNotification.amount = transfer.amount;
                TansferFromFailNotification.error = 'exception';
                return emit(TransferFromFailNotification);
            });
    }
    else {
        var TransferFromFailNotification = getFactory().newEvent('org.acme.usetech', 'TransferFromFailNotification');
        TransferFromFailNotification.walletFrom = transfer.walletFrom;
        TransferFromFailNotification.walletTo = transfer.walletTo;
        TransferFromFailNotification.amount = transfer.amount;
        TransferFromFailNotification.error = 'Conditions are not met';
        return emit(TransferFromFailNotification);
    }
}

/**
 participant GroupWaller identified by groupWalletId {
   o String groupWalletId
   o DateTime finishDate
   --> Money[] money
   o Wallet targetWallet
   o Boolean canReturnMoney
   o Double moneyMaxLimit
 }
 * Track the transfer of an amount from owner to wallet
 * @param {org.acme.usetech.TransferToGroupWallet} transfer - the trade to be processed
 * @transaction
 */
function transferToGroupWallet(transfer) {
    if (transfer.amount > 0
        && transfer.walletFrom.money.amount > transfer.amount
        && transfer.walletTo.money.amount + transfer.amount > transfer.walletTo.money.amount) {
        var factory = getFactory();
        transfer.walletFrom.money.amount -= transfer.amount;
        transfer.walletTo.money.amount += transfer.amount;

        return getAssetRegistry('org.acme.usetech.Money').then(function (assetRegistry) {
            // Get the factory for creating new asset instances.
            var factory = getFactory();
            // Create the money.
            var newMoney = factory.newResource('org.acme.usetech', 'Money', 'MONEY_1');
            newMoney.amount = transfer.amount;
            newMoney.owner = transfer.walletFrom.money.owner;
            // Add the money to the money asset registry.
            return assetRegistry.add(newMoney);
        })
            .catch(function (error) {
                var TransactionToGroupWalletNotification = getFactory().newEvent('org.acme.usetech', 'TransactionToGroupWalletNotification');
                TransactionToGroupWalletNotification.walletFrom = transfer.walletFrom;
                TransactionToGroupWalletNotification.walletTo = transfer.walletTo;
                TransactionToGroupWalletNotification.amount = transfer.amount;
                TransactionToGroupWalletNotification.error = 'exception';
                return emit(TransactionToGroupWalletNotification);
            });
    }
    else {
        var TransactionToGroupWalletFailNotification = getFactory().newEvent('org.acme.usetech', 'TransactionToGroupWalletFailNotification');
        TransactionToGroupWalletFailNotification.walletFrom = transfer.walletFrom;
        TransactionToGroupWalletFailNotification.walletTo = transfer.walletTo;
        TransactionToGroupWalletFailNotification.amount = transfer.amount;
        TransactionToGroupWalletFailNotification.error = 'Conditions are not met';
        return emit(TransactionToGroupWalletFailNotification);
    }
}

/* subscribing on events
*
*  This includes an event called BasicEvent which was created in the publishing events documentation.
*  The eventId property is always the same as the transactionId of the transaction which emitted the event,
*  with an appended number in the form "transactionId": "<transactionId>#number".
*


businessNetworkConnection.on('event', (event) => {
    // event: { "$class": "org.namespace.BasicEvent", "eventId": "0000-0000-0000-000000#0" }
    console.log(event);
});

*/