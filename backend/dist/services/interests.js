"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInterest = exports.createInterest = void 0;
const exception_1 = __importDefault(require("../utils/exception"));
const db = require('../utils/db');
const appinit_1 = require("./appinit");
//******************************************************************************************** */
// Inserts an interest record
function createInterest(code, customer, sequence, amount, creation) {
    let appInit = new appinit_1.AppInit();
    return new Promise(function (resolve, reject) {
        var sqlStr = "INSERT INTO interests (CREDITCODE, CUSTOMER, SEQUENCE, AMOUNT, CREATION) VALUES ?";
        var values = [
            [code, customer, sequence, amount, appInit.SQLDateTime(creation)]
        ];
        try {
            db.query(sqlStr, [values], function (err, result) {
                if (err) {
                    const rtn = (0, exception_1.default)(100, err.code, 'bachend.createInterest', err);
                    console.error(rtn);
                    return resolve('{"code": "' + rtn.code + '", "message": "' + rtn.message + '"}');
                }
                resolve('{"code": ' + 200 + ', "message": "Successful Transaction"}');
            });
        }
        catch (err) {
            const rtn = (0, exception_1.default)(100, err.code, 'bachend.createInterest', err);
            console.error(rtn);
            return resolve('{"code": "' + rtn.code + '", "message": "' + rtn.message + '"}');
        }
    });
}
exports.createInterest = createInterest;
//******************************************************************************************** */
// Update an interest record
function updateInterest(code, amount) {
    let appInit = new appinit_1.AppInit();
    return new Promise(function (resolve, reject) {
        var sqlStr = "UPDATE interests SET " +
            "AMOUNT = " + amount +
            " WHERE CREDITCODE = '" + code + "'";
        try {
            db.query(sqlStr, function (err, result) {
                if (err) {
                    const rtn = (0, exception_1.default)(100, err.code, 'bachend.createInterest', err);
                    console.error(rtn);
                    return reject('{"code": "' + rtn.code + '", "message": "' + rtn.message + '"}');
                }
                resolve('{"code": ' + 200 + ', "message": "Successful Transaction"}');
            });
        }
        catch (err) {
            const rtn = (0, exception_1.default)(100, err.code, 'bachend.createInterest', err);
            console.error(rtn);
            return reject('{"code": "' + rtn.code + '", "message": "' + rtn.message + '"}');
        }
    });
}
exports.updateInterest = updateInterest;
