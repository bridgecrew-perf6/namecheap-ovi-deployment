"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppInit = void 0;
const db = require('../utils/db');
const moment = require('moment');
class AppInit {
    constructor() {
        this.userProcess = 'PROCESS';
        this.isrIGC = 0;
        this.transferCharge = 0;
        this.transferCommission = 0;
    }
    // Loads Settings
    LoadSettings() {
        let sqlStr = "SELECT * FROM settings WHERE CODE = 'GENERALCONFIG'";
        db.query(sqlStr, (err, result, fields) => {
            if (err) {
                console.log(err);
                return;
            }
            var result = JSON.stringify(result);
            var Data = JSON.parse(result);
            var Config = JSON.parse(Data[0].DATA);
            this.isrIGC = Config[0]['IGC'];
            this.transferCharge = Config[0]['Transfer Charge'];
            this.transferCommission = Config[0]['Transfer Commission'];
            return result;
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
