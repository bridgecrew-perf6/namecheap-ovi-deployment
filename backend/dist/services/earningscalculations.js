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
const investments = require("../services/investments");
// Investment Status
var InvestmentStatus;
(function (InvestmentStatus) {
    InvestmentStatus[InvestmentStatus["active"] = 0] = "active";
    InvestmentStatus[InvestmentStatus["processed"] = 1] = "processed";
    InvestmentStatus[InvestmentStatus["finalized"] = 2] = "finalized";
    InvestmentStatus[InvestmentStatus["canceled"] = 3] = "canceled";
})(InvestmentStatus || (InvestmentStatus = {}));
// Investments Transaction Types
var investmentsTransactionTypes;
(function (investmentsTransactionTypes) {
    investmentsTransactionTypes[investmentsTransactionTypes["investment"] = 0] = "investment";
    investmentsTransactionTypes[investmentsTransactionTypes["payment"] = 1] = "payment";
    investmentsTransactionTypes[investmentsTransactionTypes["reinvestment"] = 2] = "reinvestment";
})(investmentsTransactionTypes || (investmentsTransactionTypes = {}));
// Investments Types
var investmentsTypes;
(function (investmentsTypes) {
    investmentsTypes[investmentsTypes["compoundInterest"] = 0] = "compoundInterest";
    investmentsTypes[investmentsTypes["simpleInterest"] = 1] = "simpleInterest";
})(investmentsTypes || (investmentsTypes = {}));
// Investment Calculus Row
class CalculusRow {
    constructor(_customer, _investmentCode, _days, _date, _initialAmount, _baseOfCalculus, _gain, _balance, _gainsTotal, _investmentTotal) {
        this.customer = _customer;
        this.investmentCode = _investmentCode;
        this.days = _days;
        this.date = _date;
        this.initialAmount = _initialAmount;
        this.baseOfCalculus = _baseOfCalculus;
        this.gain = _gain;
        this.balance = _balance;
        this.gainsTotal = _gainsTotal;
        this.investmentTotal = _investmentTotal;
    }
    ;
}
// Calculates the investments Gains
class Calculus {
    constructor() {
        this.initialInvestment = 0;
        this.type = 0;
        this.baseOfCalculus = 0;
        this.balance = 0; // Last calculation
        this.rate = 0;
        this.gain = 0;
        this.elapsedDays = 0;
        this.elapsedMonths = 0;
        this.gainsTotal = 0; // Only for simulation
        this.gainsCustomer = 0;
        this.investmentTotal = 0; // Only for simulation
    }
    // bool LeapYear = false;
    DaysBetween(From, To) {
        let daysBetweenDates = 0;
        if (From != undefined && To != undefined) {
            let timeInMilisec = From.getTime() - To.getTime();
            daysBetweenDates = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));
        }
        return daysBetweenDates;
    }
    Set(_initialInvestment, _type, _rate, _creation, _lastCalculation, _elapsedDays, _gains) {
        this.gainsCustomer = _gains;
        this.initialInvestment = _initialInvestment;
        this.type = _type;
        this.rate = _rate / 100;
        this.creationDate = _creation;
        this.lastCalculation = _lastCalculation;
        this.baseOfCalculus = this.initialInvestment;
        this.balance = this.initialInvestment;
        this.elapsedDays = _elapsedDays;
        //
        // leapYear = AppInit.isLeapYear(DateTime.now().year);
        // bool isFebruary = date.month == 2;
        // if (!isFebruary && days < 30 ||
        //     isFebruary && !leapYear && days < 28 ||
        //     isFebruary && leapYear && days < 29) {
        //   continue;
        // }
    }
    // Execute calculation
    Execute(simulation) {
        this.elapsedDays = this.elapsedDays + 30;
        let months = this.elapsedDays / 30;
        this.elapsedMonths = Math.trunc(months); // Get the integer part
        if (this.creationDate != undefined && this.lastCalculation != undefined) {
            this.creationDate = new Date(this.creationDate);
            this.lastCalculation = new Date(this.lastCalculation);
            if (simulation) {
                this.lastCalculation.setDate(this.creationDate.getDate() + 30);
            }
        }
        if (this.type == investmentsTypes.compoundInterest) {
            this.gain = this.baseOfCalculus * this.rate;
            this.balance = this.balance + this.gain;
        }
        else {
            this.gain = this.baseOfCalculus * this.rate;
            this.balance = this.balance + this.gain;
        }
        this.gainsTotal = this.gainsTotal + this.gain;
        this.gainsCustomer = this.gainsCustomer + this.gain;
    }
    // Execute calculation if a month has passed
    TryExecute() {
        let rsl = false;
        let tempElapsedDays = this.elapsedDays + 30;
        let DateNow = new Date();
        let _elapsedDays = this.DaysBetween(this.creationDate, DateNow);
        if (_elapsedDays >= tempElapsedDays) {
            this.Execute(false);
            rsl = true;
        }
        return rsl;
    }
    // Adds the last calculation to the Total, in a simulation the last calculation
    //  of a period is the one to consider, because is the result of adding the
    //  initial investment with all the gains of every period.
    Total() {
        this.investmentTotal = this.investmentTotal + this.balance;
    }
    // Transfers the investment calculation to the next initial investment value
    //  that serves as calculation base for the next calculation in case of
    //  simulations
    Next() {
        if (this.type == investmentsTypes.compoundInterest) {
            this.baseOfCalculus = this.balance;
        }
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
            var result = yield investments.readAllMainInvestments();
            this.investList = JSON.parse(result);
            this.calculusTable = [];
            if (this.investList.length == 0) {
                return;
            }
            //**************************************************************************
            // Do Projection Calculation
            let months = totalDays / 30;
            let calculus = new Calculus();
            for (let i = 0; i < this.investList.length; i++) {
                let actualBalance = this.investList[i].AMOUNT + this.investList[i].INCREMENT +
                    (this.investList[i].GAIN - this.investList[i].TOTALPAID);
                calculus.Set(actualBalance, this.investList[i].INVESTMENTTYPE, this.investList[i].RATE, this.investList[i].CREATION, this.investList[i].LASTCALCULATION, this.investList[i].ELAPSEDDAYS, this.investList[i].GAIN);
                for (let m = 0; m < months; m++) {
                    calculus.Execute(true);
                    if (calculus.elapsedDays <= this.investList[i].DURATION) {
                        let calcRow = new CalculusRow(this.investList[i].NAMES, this.investList[i].CODE, calculus.elapsedDays, calculus.lastCalculation, calculus.initialInvestment, calculus.baseOfCalculus, calculus.gain, calculus.balance, calculus.gainsTotal, calculus.investmentTotal);
                        calculus.Next();
                        this.calculusTable.push(calcRow);
                        // Saves Record
                        if (saveRecord) {
                            yield this.SaveRecord(i, calculus.elapsedMonths, calculus.gain, calculus.lastCalculation, calculus.elapsedDays, calculus.creationDate, calculus.gainsCustomer);
                        }
                    }
                }
                calculus.Total();
                if (this.calculusTable.length > 0) {
                    this.calculusTable[this.calculusTable.length - 1].investmentTotal = calculus.investmentTotal;
                }
            }
            var JsonString = JSON.stringify(this.calculusTable);
            return JsonString;
        });
    }
    // Execute
    Execute(saveRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = yield investments.readAllMainInvestments();
            this.investList = JSON.parse(result);
            this.calculusTable = [];
            if (this.investList.length == 0) {
                return;
            }
            // Executes calculations
            let calculus = new Calculus();
            for (let i = 0; i < this.investList.length; i++) {
                let actualBalance = this.investList[i].AMOUNT + this.investList[i].INCREMENT +
                    (this.investList[i].GAIN - this.investList[i].TOTALPAID);
                calculus.Set(actualBalance, this.investList[i].INVESTMENTTYPE, this.investList[i].RATE, this.investList[i].CREATION, this.investList[i].LASTCALCULATION, this.investList[i].ELAPSEDDAYS, this.investList[i].GAIN);
                let rsl = calculus.TryExecute();
                if (rsl == true && calculus.elapsedDays <= this.investList[i].DURATION) {
                    let calcRow = new CalculusRow(this.investList[i].NAMES, this.investList[i].CODE, calculus.elapsedDays, calculus.lastCalculation, calculus.initialInvestment, calculus.baseOfCalculus, calculus.gain, calculus.balance, calculus.gainsTotal, calculus.investmentTotal);
                    calculus.Next();
                    this.calculusTable.push(calcRow);
                    calculus.Total();
                    // Saves Record
                    if (saveRecord) {
                        yield this.SaveRecord(i, calculus.elapsedMonths, calculus.gain, calculus.lastCalculation, calculus.elapsedDays, calculus.creationDate, calculus.gainsCustomer);
                    }
                }
            }
        });
    }
    // Saves Record
    SaveRecord(_i, _elapsedMonths, _gain, _lastCalculation, _elapsedDays, _creationDate, _gainsCustomer) {
        return __awaiter(this, void 0, void 0, function* () {
            let appInit = new appinit_1.AppInit();
            // Creates Reinvestment Record
            let res = yield investments.createInvestment(0, _elapsedMonths, this.investList[_i].CUSTOMER, this.investList[_i].CODE, investmentsTransactionTypes.investment, this.investList[_i].INVESTMENTTYPE, this.investList[_i].BRANCH, _gain, this.investList[_i].CURRENCY, this.investList[_i].RATE, this.investList[_i].PENALTY, this.investList[_i].FIXEDPAYMENT, this.investList[_i].BENEFICIARIES, this.investList[_i].SECONDARYOWNERS, 0, this.investList[_i].EARNINGSCOLLECTIONPERIOD, this.investList[_i].DURATION, 0, 0, 0, appInit.SQLDateTime(_lastCalculation), _gain, _elapsedDays, 0, 0, 0, '', appInit.SQLDateTime(_lastCalculation), appInit.userProcess, appInit.SQLDateTime(_lastCalculation), InvestmentStatus.processed);
            var resJson = JSON.parse(res);
            if (resJson.code == 200) {
                // Updates investment GAIN, ELAPSEDDAYS, LASTCALCULATION, STATUS
                res = yield investments.updateInvestmentProcess(this.investList[_i].CODE, _lastCalculation, _gainsCustomer, _elapsedDays, InvestmentStatus.processed);
                resJson = JSON.parse(res);
                if (resJson.code == 200) {
                    // If Investment Elapsed, Update Status to (Finalized)
                    if (this.investList[_i].duration == _elapsedDays) {
                        res = yield investments.updateInvestmentStatus(this.investList[_i].CODE, InvestmentStatus.finalized);
                        resJson = JSON.parse(res);
                    }
                }
            }
            return resJson;
        });
    }
}
exports.EarningsCalculations = EarningsCalculations;
