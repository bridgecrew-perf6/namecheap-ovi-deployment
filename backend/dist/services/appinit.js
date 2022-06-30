"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppInit = void 0;
const exception_1 = __importDefault(require("../utils/exception"));
const db = require('../utils/db');
const moment = require('moment');
class AppInit {
    constructor() {
        this.userProcess = 'PROCESS';
        this.distributionRate = 0;
    }
    // Loads Settings
    LoadSettings() {
        let sqlStr = "SELECT * FROM settings WHERE CODE = 'GENERALCONFIG'";
        return new Promise((resolve, reject) => {
            db.query(sqlStr, (err, result, fields) => {
                if (err) {
                    const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateCreditProcess', err);
                    console.error(rtn);
                    return resolve('{"code": "' + rtn.code + '", "message": "' + rtn.message + '"}');
                }
                var result = JSON.stringify(result);
                var Data = JSON.parse(result);
                var Config = JSON.parse(Data[0].DATA);
                this.distributionRate = Config['DistributionRate'];
                resolve(result);
            });
        });
    }
    // Calculates Days between to Dates
    DaysBetween(From, To) {
        let daysBetweenDates = 0;
        if (From != undefined && To != undefined) {
            let timeInMilisec = From.getTime() - To.getTime();
            daysBetweenDates = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));
        }
        return daysBetweenDates;
    }
    // Date Time to SQL Time Stamp
    SQLDateTime(date) {
        moment.locale('en-USr');
        let rsl = moment(date).local().format("YYYY-MM-DD HH:mm:ss");
        return rsl;
    }
}
exports.AppInit = AppInit;
