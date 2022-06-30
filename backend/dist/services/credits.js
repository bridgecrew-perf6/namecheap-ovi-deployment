"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCreditStatus = exports.updateCreditProcess = exports.createCredit = exports.readAllCredits = void 0;
const exception_1 = __importDefault(require("../utils/exception"));
const db = require('../utils/db');
const appinit_1 = require("./appinit");
//******************************************************************************************** */
// Read all credits and returns a JSON
function readAllCredits() {
    return new Promise(function (resolve, reject) {
        var sqlStr = "SELECT credits.*, customers.NAMES FROM credits " +
            "LEFT JOIN customers ON customers.CODE = credits.CUSTOMER " +
            "WHERE credits.STATUS < 2 " +
            "ORDER BY credits.CUSTOMER";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.readAllCredits', err);
                console.error(rtn);
                return resolve('{"code": "' + rtn.code + '", "message": "' + rtn.message + '"}');
            }
            result = JSON.stringify(result);
            resolve(result);
        });
    });
}
exports.readAllCredits = readAllCredits;
//******************************************************************************************** */
// Read all investments and returns a JSON
// export function readAllMainInvestments()
// {
//     return new Promise<string>(function(resolve, reject) {
//         var sqlStr = "SELECT investments.*, customers.NAMES, customers.STATUS FROM investments "+             
//                      "LEFT JOIN customers ON customers.CODE = investments.CUSTOMER "+
// 				  	 "WHERE investments.STATUS < 2 AND investments.CODE = investments.ORIGIN AND customers.STATUS < 6 "+
//                      "ORDER BY investments.CUSTOMER, investments.ORIGIN, investments.SEQUENCE";
//         db.query(sqlStr, function (err: { code: string; }, result: string, fields: any) {
//             if (err) {
//                 const rtn = errorManagment(100, err.code, 'bachend.readAllMainInvestments', err);
//                 console.error(rtn);
//                 return resolve(
//                     '{"code": '+rtn.code+', "message": "'+rtn.message+'"}'
//                 );
//             }
//             result = JSON.stringify(result);
//             resolve(result);
//         });
//     });
// }
//******************************************************************************************** */
// Inserts an investment record
function createCredit(code, customer, creditSelection, initialCredit, creditIncreases, interests, debits, transfers, fees, feesChanges, creation, userModified, modification, sequence, status) {
    let appInit = new appinit_1.AppInit();
    return new Promise(function (resolve, reject) {
        var sqlStr = "INSERT INTO credits (CODE, CUSTOMER, CREDITSELECTION, INITIALCREDIT, " +
            "CREDITINCREASES, INTERESTS, DEBITS, TRANSFERS, " +
            "FEES, FEESCHANGES, CREATION, USERMODIFIED, " +
            "MODIFICATION, CANCELLED, SEQUENCE, STATUS) VALUES ?";
        var values = [
            [code, customer, creditSelection, initialCredit,
                creditIncreases, interests, debits, transfers,
                fees, feesChanges, appInit.SQLDateTime(creation), userModified,
                appInit.SQLDateTime(modification), null, sequence, status]
        ];
        db.query(sqlStr, [values], function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.createCredit', err);
                console.error(rtn);
                return resolve('{"code": "' + rtn.code + '", "message": "' + rtn.message + '"}');
            }
            sqlStr = 'SELECT LAST_INSERT_ID()';
            db.query(sqlStr, function (err, result) {
                if (err) {
                    const rtn = (0, exception_1.default)(100, err.code, 'bachend.createCredit', err);
                    console.error(rtn);
                    return reject('{"code": "' + rtn.code + '", "message": "' + rtn.message + '"}');
                }
                resolve('{"code": ' + result[0]['LAST_INSERT_ID()'] + ', "message": "Successful Transaction"}');
            });
        });
    });
}
exports.createCredit = createCredit;
//******************************************************************************************** */
// Updates credit CREDITINCREASES, INTERESTS, DEBITS, TRANSFERS, FEES, STATUS
function updateCreditProcess(code, creditSelection, creditIncreases, interests, debits, transfers, fees, feesChanges, status) {
    let appInit = new appinit_1.AppInit();
    return new Promise(function (resolve, reject) {
        var sqlStr = "UPDATE credits SET " +
            "CREDITSELECTION = " + creditSelection + ", " +
            "CREDITINCREASES = " + creditIncreases + ", " +
            "INTERESTS = " + interests + ", " +
            "DEBITS = " + debits + ", " +
            "TRANSFERS = " + transfers + ", " +
            "FEES = " + fees + ", " +
            "FEESCHANGES = " + feesChanges + ", " +
            "STATUS = " + status +
            " WHERE CODE = '" + code + "'";
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateCreditProcess', err);
                console.error(rtn);
                return resolve('{"code": "' + rtn.code + '", "message": "' + rtn.message + '"}');
            }
            resolve('{"code": ' + 200 + ', "message": "Successful Transaction"}');
        });
    });
}
exports.updateCreditProcess = updateCreditProcess;
//******************************************************************************************** */
// UPDATE CREDIT STATUS
function updateCreditStatus(code, status, user, modification) {
    return new Promise(function (resolve, reject) {
        var sqlStr = "UPDATE credits SET " +
            "USERMODIFIED = '" + user + "', " +
            "MODIFICATION = '" + modification + "', " +
            "STATUS = " + status +
            " WHERE CODE = " + code;
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateCreditStatus', err);
                console.error(rtn);
                return resolve('{"code": "' + rtn.code + '", "message": "' + rtn.message + '"}');
            }
            resolve('{"code": ' + 200 + ', "message": "Successful Transaction"}');
        });
    });
}
exports.updateCreditStatus = updateCreditStatus;
