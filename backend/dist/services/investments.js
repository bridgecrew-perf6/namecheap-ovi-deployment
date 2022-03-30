"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInvestmentStatus = exports.updateInvestmentProcess = exports.createInvestment = exports.readAllMainInvestments = exports.readAllInvestments = void 0;
const exception_1 = __importDefault(require("../utils/exception"));
const db = require('../utils/db');
const appinit_1 = require("../services/appinit");
//******************************************************************************************** */
// Read all investments and returns a JSON
function readAllInvestments() {
    return new Promise(function (resolve, reject) {
        var sqlStr = "SELECT investments.*, customers.NAMES FROM investments " +
            "LEFT JOIN customers ON customers.CODE = investments.CUSTOMER " +
            "WHERE investments.STATUS < 2 " +
            "ORDER BY investments.CUSTOMER, investments.ORIGIN, investments.SEQUENCE";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.readAllInvestments', err);
                console.error(rtn);
                return reject('{"code": ' + rtn.code + ', "message": "' + rtn.message + '"}');
            }
            result = JSON.stringify(result);
            resolve(result);
        });
    });
}
exports.readAllInvestments = readAllInvestments;
//******************************************************************************************** */
// Read all investments and returns a JSON
function readAllMainInvestments() {
    return new Promise(function (resolve, reject) {
        var sqlStr = "SELECT investments.*, customers.NAMES, customers.STATUS FROM investments " +
            "LEFT JOIN customers ON customers.CODE = investments.CUSTOMER " +
            "WHERE investments.STATUS < 2 AND investments.CODE = investments.ORIGIN AND customers.STATUS < 6 " +
            "ORDER BY investments.CUSTOMER, investments.ORIGIN, investments.SEQUENCE";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.readAllMainInvestments', err);
                console.error(rtn);
                return reject('{"code": ' + rtn.code + ', "message": "' + rtn.message + '"}');
            }
            result = JSON.stringify(result);
            resolve(result);
        });
    });
}
exports.readAllMainInvestments = readAllMainInvestments;
//******************************************************************************************** */
// Inserts an investment record
function createInvestment(code, sequence, customer, origin, transactionType, investmentType, branch, amount, currency, rate, penalty, fixedPayment, beneficiaries, secondaryOwners, penaltyAmount, earningsCollectionPeriod, duration, isr, transferCharge, transferCommission, lastCalculation, gain, elapsedDays, totalPaid, increment, reference, taxpayerIdentificationNumber, creation, userModified, modification, status) {
    let appInit = new appinit_1.AppInit();
    return new Promise(function (resolve, reject) {
        var sqlStr = "INSERT INTO investments (CODE, SEQUENCE, CUSTOMER, ORIGIN, TRANSACTIONTYPE, " +
            "INVESTMENTTYPE, BRANCH, AMOUNT, CURRENCY, RATE, " +
            "PENALTY, FIXEDPAYMENT, BENEFICIARIES, SECONDARYOWNERS, PENALTYAMOUNT, " +
            "EARNINGSCOLLECTIONPERIOD, DURATION, ISR, TRANSFERCHARGE, TRANSFERCOMMISSION, " +
            "LASTCALCULATION, GAIN, ELAPSEDDAYS, TOTALPAID, INCREMENT, " +
            "REFERENCE, TAXPAYERIDENTIFICATIONNUMBER, CREATION, USERMODIFIED, MODIFICATION, " +
            "STATUS) VALUES ?";
        var values = [
            [code, sequence, customer, origin, transactionType,
                investmentType, branch, amount, currency, rate,
                penalty, fixedPayment, beneficiaries, secondaryOwners, penaltyAmount,
                earningsCollectionPeriod, duration, isr, transferCharge, transferCommission,
                appInit.SQLDateTime(lastCalculation), gain, elapsedDays, totalPaid, increment,
                reference, taxpayerIdentificationNumber, appInit.SQLDateTime(creation), userModified, appInit.SQLDateTime(modification),
                status]
        ];
        db.query(sqlStr, [values], function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.createInvestment', err);
                console.error(rtn);
                return reject('{"code": ' + rtn.code + ', "message": "' + rtn.message + '"}');
            }
            sqlStr = 'SELECT LAST_INSERT_ID()';
            db.query(sqlStr, function (err, result) {
                if (err) {
                    const rtn = (0, exception_1.default)(100, err.code, 'bachend.createInvestment', err);
                    console.error(rtn);
                    return reject('{"code": ' + rtn.code + ', "message": "' + rtn.message + '"}');
                }
                var jsonstring = JSON.stringify(result);
                var json = JSON.parse(jsonstring);
                code = json[0]['LAST_INSERT_ID()'];
                if (origin == 0) {
                    sqlStr = 'UPDATE investments SET ORIGIN = ' + code + ' WHERE CODE = ' + code + ';';
                    db.query(sqlStr, function (err, result) {
                        if (err) {
                            const rtn = (0, exception_1.default)(100, err.code, 'bachend.createInvestment', err);
                            console.error(rtn);
                            return reject('{"code": ' + rtn.code + ', "message": "' + rtn.message + '"}');
                        }
                        resolve('{"code": ' + 200 + ', "message": "Successful Transaction"}');
                    });
                }
                else {
                    resolve('{"code": ' + 200 + ', "message": "Successful Transaction"}');
                }
            });
        });
    });
}
exports.createInvestment = createInvestment;
//******************************************************************************************** */
// Updates investment GAIN, ELAPSEDDAYS, LASTCALCULATION, STATUS
function updateInvestmentProcess(code, lastCalculation, gain, elapsedDays, status) {
    let appInit = new appinit_1.AppInit();
    return new Promise(function (resolve, reject) {
        var sqlStr = "UPDATE investments SET " +
            "GAIN = '" + gain + "', " +
            "ELAPSEDDAYS = '" + elapsedDays + "', " +
            "LASTCALCULATION = '" + appInit.SQLDateTime(lastCalculation) + "', " +
            "STATUS = " + status +
            " WHERE CODE = '" + code + "'";
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateInvestmentProcess', err);
                console.error(rtn);
                return reject('{"code": ' + rtn.code + ', "message": "' + rtn.message + '"}');
            }
            resolve('{"code": ' + 200 + ', "message": "Successful Transaction"}');
        });
    });
}
exports.updateInvestmentProcess = updateInvestmentProcess;
//******************************************************************************************** */
// UPDATE INVESTMENT STATUS OF ALL RECORD MATCHING CODE OR ORIGIN
function updateInvestmentStatus(code, status) {
    return new Promise(function (resolve, reject) {
        var sqlStr = "UPDATE investments SET " +
            "STATUS = " + status +
            " WHERE CODE = '" + code + "' OR ORIGIN = '" + code + "'";
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateInvestmentStatus', err);
                console.error(rtn);
                return reject('{"code": ' + rtn.code + ', "message": "' + rtn.message + '"}');
            }
            resolve('{"code": ' + 200 + ', "message": "Successful Transaction"}');
        });
    });
}
exports.updateInvestmentStatus = updateInvestmentStatus;
