"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTIN = exports.createNewTIN = void 0;
const exception_1 = __importDefault(require("../utils/exception"));
const db = require('../utils/db');
//******************************************************************************************** */
// Creates New TIN
function createNewTIN(TINCode, res) {
    return new Promise(function (resolve, reject) {
        var sqlStr = "UPDATE tin SET " +
            "COUNTER = COUNTER + 1" +
            " WHERE code = '" + TINCode + "'";
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.createNewTIN', err);
                console.error(rtn);
                return reject(res.status(rtn.code).send({
                    message: rtn.message,
                }));
            }
            sqlStr = "SELECT * FROM tin WHERE code = '" + TINCode + "'";
            db.query(sqlStr, function (err, result, fields) {
                if (err) {
                    const rtn = (0, exception_1.default)(100, err.code, 'bachend.createNewTIN', err);
                    console.error(rtn);
                    return reject(res.status(rtn.code).send({
                        message: rtn.message,
                    }));
                }
                result = JSON.stringify(result);
                resolve(result);
            });
        });
    });
}
exports.createNewTIN = createNewTIN;
//******************************************************************************************** */
// Format TIN
function formatTIN(TINCode, Counter) {
    var secuence = '00000000' + Counter.toString();
    var sufix = secuence.substring(secuence.length - 8, secuence.length);
    var result = 'B' + TINCode + sufix;
    return result;
}
exports.formatTIN = formatTIN;
