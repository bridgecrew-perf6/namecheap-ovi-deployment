"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarningsCalculations = void 0;
const appinit_1 = require("../services/appinit");
const credits = require("./credits");
const interests = require("../services/interests");
// Transaction Status
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus[TransactionStatus["active"] = 0] = "active";
    TransactionStatus[TransactionStatus["processed"] = 1] = "processed";
    TransactionStatus[TransactionStatus["niu1"] = 2] = "niu1";
    TransactionStatus[TransactionStatus["niu2"] = 3] = "niu2";
    TransactionStatus[TransactionStatus["niu3"] = 4] = "niu3";
    TransactionStatus[TransactionStatus["canceled"] = 5] = "canceled";
})(TransactionStatus || (TransactionStatus = {}));
// Credit Calculus Row
class CalculusRow {
    constructor(_customer, _creditCode, _sequence, _initialCredit, _creditIncreases, _interests, _debits, _transfers, _fees, _feesChanges, _distributionRate, _interest, _balance, _date) {
        this.sequence = 0;
        this.initialCredit = 0;
        this.creditIncreases = 0;
        this.interests = 0;
        this.debits = 0;
        this.transfers = 0;
        this.fees = 0;
        this.feesChanges = 0;
        this.distributionRate = 0;
        this.interest = 0;
        this.balance = 0;
        this.date = new Date();
        this.customer = _customer;
        this.creditCode = _creditCode;
        this.sequence = _sequence;
        this.initialCredit = _initialCredit;
        this.creditIncreases = _creditIncreases;
        this.interests = _interests;
        this.debits = _debits;
        this.transfers = _transfers;
        this.fees = _fees;
        this.feesChanges = _feesChanges;
        this.distributionRate = _distributionRate;
        this.interest = _interest;
        this.balance = _balance;
        this.date = new Date(_date);
    }
    ;
}
// Calculates the Credits Interests
class Calculus {
    constructor() {
        this.initialCredit = 0;
        this.creditIncreases = 0;
        this.interests = 0;
        this.debits = 0;
        this.transfers = 0;
        this.fees = 0;
        this.feesChanges = 0;
        this.distributionRate = 0;
        this.interest = 0;
        this.balance = 0;
    }
    DaysBetween(From, To) {
        let daysBetweenDates = 0;
        if (From != undefined && To != undefined) {
            let timeInMilisec = From.getTime() - To.getTime();
            daysBetweenDates = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));
        }
        return daysBetweenDates;
    }
    LoadDistributionRate() {
        return __awaiter(this, void 0, void 0, function* () {
            let appInit = new appinit_1.AppInit();
            yield appInit.LoadSettings();
            this.distributionRate = appInit.distributionRate / 100;
        });
    }
    Set(_initialCredit, _creditIncreases, _interests, _debits, _transfers, _fees, _feesChanges, _creation) {
        this.initialCredit = _initialCredit;
        this.creditIncreases = _creditIncreases;
        this.interests = _interests;
        this.debits = _debits;
        this.transfers = _transfers;
        this.fees = _fees;
        this.feesChanges = _feesChanges;
        this.creation = new Date(_creation);
    }
    // Execute calculation
    Execute() {
        let totalCredit = (this.initialCredit + this.creditIncreases) - this.feesChanges;
        this.interest = totalCredit * this.distributionRate;
        let cr = (this.initialCredit + this.creditIncreases + this.interests);
        let db = (this.debits + this.transfers + this.fees);
        this.balance = cr - db;
    }
    // Execute calculation if a day has passed
    TryExecute() {
        let rsl = false;
        let DateNow = new Date();
        let _elapsedDays = this.DaysBetween(this.creation, DateNow);
        if (_elapsedDays >= 1) {
            this.Execute();
            rsl = true;
        }
        return rsl;
    }
    // Adds the last calculation to the Total, in a simulation the last calculation
    //  of a period is the one to consider, because is the result of adding the
    //  initial investment with all the gains of every period.
    Total() {
        this.interests = this.interests + this.interest;
    }
}
// Earnings Calculation
class EarningsCalculations {
    constructor() {
        this.investList = [];
        this.calculusTable = [];
    }
    // Simulate Calculation
    Simulate(totalDays, saveRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = yield credits.readAllCredits();
            this.investList = JSON.parse(result);
            this.calculusTable = [];
            if (this.investList.length == 0) {
                return;
            }
            //**************************************************************************
            // Do Projection Calculation
            let calculus = new Calculus();
            yield calculus.LoadDistributionRate();
            let DateNow = new Date();
            for (let i = 0; i < this.investList.length; i++) {
                calculus.Set(this.investList[i].INITIALCREDIT, this.investList[i].CREDITINCREASES, this.investList[i].INTERESTS, this.investList[i].DEBITS, this.investList[i].TRANSFERS, this.investList[i].FEES, this.investList[i].FEESCHANGES, this.investList[i].CREATION);
                for (let d = 0; d < totalDays; d++) {
                    let sequence = calculus.DaysBetween(DateNow, calculus.creation);
                    calculus.Execute();
                    let calcRow = new CalculusRow(this.investList[i].NAMES, this.investList[i].CODE, sequence, calculus.initialCredit, calculus.creditIncreases, calculus.interests, calculus.debits, calculus.transfers, calculus.fees, calculus.feesChanges, calculus.distributionRate, calculus.interest, calculus.balance, DateNow);
                    this.calculusTable.push(calcRow);
                    calculus.Total();
                    DateNow.setDate(DateNow.getDate() + 1);
                    // Saves Record
                    if (saveRecord) {
                        yield this.SaveRecord(i, sequence, calculus.interest, calculus.interests, DateNow);
                    }
                }
            }
            var JsonString = JSON.stringify(this.calculusTable);
            this.calculusTable = [];
            return JsonString;
        });
    }
    // Execute
    Execute(saveRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = yield credits.readAllCredits();
            this.investList = JSON.parse(result);
            this.calculusTable = [];
            if (this.investList.length == 0) {
                return;
            }
            //**************************************************************************
            // Do Projection Calculation
            let calculus = new Calculus();
            yield calculus.LoadDistributionRate();
            let DateNow = new Date();
            for (let i = 0; i < this.investList.length; i++) {
                calculus.Set(this.investList[i].INITIALCREDIT, this.investList[i].CREDITINCREASES, this.investList[i].INTERESTS, this.investList[i].DEBITS, this.investList[i].TRANSFERS, this.investList[i].FEES, this.investList[i].FEESCHANGES, this.investList[i].CREATION);
                let sequence = calculus.DaysBetween(DateNow, calculus.creation);
                calculus.Execute();
                let calcRow = new CalculusRow(this.investList[i].NAMES, this.investList[i].CODE, sequence, calculus.initialCredit, calculus.creditIncreases, calculus.interests, calculus.debits, calculus.transfers, calculus.fees, calculus.feesChanges, calculus.distributionRate, calculus.interest, calculus.balance, DateNow);
                //calculus.Next();
                this.calculusTable.push(calcRow);
                calculus.Total();
                // Saves Record
                if (saveRecord) {
                    yield this.SaveRecord(i, sequence, calculus.interest, calculus.interests, DateNow);
                }
            }
            this.calculusTable = [];
        });
    }
    // Saves Record
    SaveRecord(_i, _sequence, _interest, _interests, _creationDate) {
        return __awaiter(this, void 0, void 0, function* () {
            let appInit = new appinit_1.AppInit();
            // Creates Interest Record
            let res = yield interests.createInterest(this.investList[_i].CODE, this.investList[_i].CUSTOMER, _sequence, _interest, _creationDate);
            var resJson = JSON.parse(res);
            // Update If Record Exists
            if (resJson.code == 'ER_DUP_ENTRY') {
                res = yield interests.updateInterest(this.investList[_i].CODE, _interest);
            }
            if (resJson.code == 200) {
                // Updates credit INTERESTS
                res = yield credits.updateCreditProcess(this.investList[_i].CODE, this.investList[_i].CREDITSELECTION, this.investList[_i].CREDITINCREASES, _interests, this.investList[_i].DEBITS, this.investList[_i].TRANSFERS, this.investList[_i].FEES, this.investList[_i].FEESCHANGES, TransactionStatus.processed);
                resJson = JSON.parse(res);
            }
            return resJson;
        });
    }
}
exports.EarningsCalculations = EarningsCalculations;
