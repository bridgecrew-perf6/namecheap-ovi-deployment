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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exception_1 = __importDefault(require("../utils/exception"));
const router = require('express').Router();
const hash = require('../utils/encryption');
const db = require('../utils/db');
const tin = require("../services/tin");
const investments = require("../services/investments");
const earningscalculations_1 = require("../services/earningscalculations");
// Investments Transaction Types
var investmentsTransactionTypes;
(function (investmentsTransactionTypes) {
    investmentsTransactionTypes[investmentsTransactionTypes["investment"] = 0] = "investment";
    investmentsTransactionTypes[investmentsTransactionTypes["payment"] = 1] = "payment";
    investmentsTransactionTypes[investmentsTransactionTypes["reinvestment"] = 2] = "reinvestment";
})(investmentsTransactionTypes || (investmentsTransactionTypes = {}));
//
// INSERT INVESTMENT
// Route: https://localhost/createInvestment
//
router.route('/createInvestment').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // cipher validation
    var auth = req.headers['auth'];
    if (auth != hash) {
        res.status(401).send({
            "message": 'Unauthorized Request',
        });
        return;
    }
    // Validate request
    if (!req.body) {
        res.status(400).send({
            "message": "Content can not be empty!",
        });
        return;
    }
    try {
        var result = yield investments.createInvestment(req.body.CODE, req.body.SEQUENCE, req.body.CUSTOMER, req.body.ORIGIN, req.body.TRANSACTIONTYPE, req.body.INVESTMENTTYPE, req.body.BRANCH, req.body.AMOUNT, req.body.CURRENCY, req.body.RATE, req.body.PENALTY, req.body.FIXEDPAYMENT, req.body.BENEFICIARIES, req.body.SECONDARYOWNERS, req.body.PENALTYAMOUNT, req.body.EARNINGSCOLLECTIONPERIOD, req.body.DURATION, req.body.ISR, req.body.TRANSFERCHARGE, req.body.TRANSFERCOMMISSION, req.body.LASTCALCULATION, req.body.GAIN, req.body.ELAPSEDDAYS, req.body.TOTALPAID, req.body.INCREMENT, req.body.REFERENCE, req.body.TAXPAYERIDENTIFICATIONNUMBER, req.body.CREATION, req.body.USERMODIFIED, req.body.MODIFICATION, req.body.STATUS);
        return res.send(result);
    }
    catch (error) {
        const err = (0, exception_1.default)(100, error.code, 'bachend.createInvestment', error);
        console.error(error);
        res.status(err.code).send({
            "message": err.message,
        });
    }
}));
//
// UPDATE INVESTMENT
// Route: https://localhost/updateInvestment
//
router.route('/updateInvestment').post((req, res) => {
    // cipher validation
    var auth = req.headers['auth'];
    if (auth != hash) {
        res.status(401).send({
            message: 'Unauthorized Request',
        });
        return;
    }
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    try {
        var sqlStr = "UPDATE investments SET " +
            "TRANSACTIONTYPE = '" + req.body.TRANSACTIONTYPE + "', " +
            "INVESTMENTTYPE = '" + req.body.INVESTMENTTYPE + "', " +
            "AMOUNT = '" + req.body.AMOUNT + "', " +
            "CURRENCY = '" + req.body.CURRENCY + "', " +
            "RATE = '" + req.body.RATE + "', " +
            "PENALTY = '" + req.body.PENALTY + "', " +
            "FIXEDPAYMENT = '" + req.body.FIXEDPAYMENT + "', " +
            "BENEFICIARIES = '" + req.body.BENEFICIARIES + "', " +
            "SECONDARYOWNERS = '" + req.body.SECONDARYOWNERS + "', " +
            "PENALTYAMOUNT = '" + req.body.PENALTYAMOUNT + "', " +
            "EARNINGSCOLLECTIONPERIOD = '" + req.body.EARNINGSCOLLECTIONPERIOD + "', " +
            "DURATION = '" + req.body.DURATION + "', " +
            "USERMODIFIED = '" + req.body.USERMODIFIED + "', " +
            "MODIFICATION = '" + req.body.MODIFICATION + "', " +
            "STATUS = " + req.body.STATUS +
            " WHERE CODE = '" + req.body.CODE + "'";
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateInvestment', err);
                console.error(rtn);
                res.status(rtn.code).send({
                    message: rtn.message,
                });
                return;
            }
            res.status(200).send({
                message: "Successful Transaction",
            });
        });
    }
    catch (error) {
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateInvestment', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// UPDATE INVESTMENT GAIN, ELAPSEDDAYS, LASTCALCULATION, STATUS
// Route: https://localhost/updateInvestmentProcess
//
router.route('/updateInvestmentProcess').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // cipher validation
    var auth = req.headers['auth'];
    if (auth != hash) {
        res.status(401).send({
            message: 'Unauthorized Request',
        });
        return;
    }
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    try {
        var result = yield investments.updateInvestmentProcess(req.body.CODE, req.body.LASTCALCULATION, req.body.GAIN, req.body.ELAPSEDDAYS, req.body.STATUS);
        return res.send(result);
    }
    catch (error) {
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateInvestmentProcess', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
//
// UPDATE INVESTMENT STATUS OF ALL RECORD MATCHING CODE OR ORIGIN
// Route: https://localhost/updateInvestmentStatus
//
router.route('/updateInvestmentStatus').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // cipher validation
    var auth = req.headers['auth'];
    if (auth != hash) {
        res.status(401).send({
            message: 'Unauthorized Request',
        });
        return;
    }
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    try {
        var result = yield investments.updateInvestmentStatus(req.body.CODE, req.body.STATUS);
        return res.send(result);
    }
    catch (error) {
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateInvestmentStatus', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
//
// UPDATE INVESTMENT TOTALPAID 
// Route: https://localhost/updateInvestmentTotalPaid
//
router.route('/updateInvestmentTotalPaid').post((req, res) => {
    // cipher validation
    var auth = req.headers['auth'];
    if (auth != hash) {
        res.status(401).send({
            message: 'Unauthorized Request',
        });
        return;
    }
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    try {
        var sqlStr = "UPDATE investments SET " +
            "TOTALPAID = " + req.body.TOTALPAID +
            " WHERE CODE = '" + req.body.CODE + "'";
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateInvestmentTotalPaid', err);
                console.error(rtn);
                res.status(rtn.code).send({
                    message: rtn.message,
                });
                return;
            }
            res.status(200).send({
                message: "Successful Transaction",
            });
        });
    }
    catch (error) {
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateInvestmentTotalPaid', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// UPDATE INVESTMENT INCREMENT
// Route: https://localhost/updateInvestmentIncrement
//
router.route('/updateInvestmentIncrement').post((req, res) => {
    // cipher validation
    var auth = req.headers['auth'];
    if (auth != hash) {
        res.status(401).send({
            message: 'Unauthorized Request',
        });
        return;
    }
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    try {
        var sqlStr = "UPDATE investments SET " +
            "INCREMENT = " + req.body.INCREMENT +
            " WHERE CODE = '" + req.body.CODE + "'";
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateInvestmentIncrement', err);
                console.error(rtn);
                res.status(rtn.code).send({
                    message: rtn.message,
                });
                return;
            }
            res.status(200).send({
                message: "Successful Transaction",
            });
        });
    }
    catch (error) {
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateInvestmentIncrement', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// GET INVESTMENT
// Route: https://localhost/getInvestment/[code]
//
router.route('/getInvestment/:code').get((req, res) => {
    // cipher validation
    var auth = req.headers['auth'];
    if (auth != hash) {
        res.status(401).send({
            message: 'Unauthorized Request',
        });
        return;
    }
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    try {
        var sqlStr = "SELECT * FROM investments WHERE customer = '" + req.params.code + "' " +
            "ORDER BY investments.CUSTOMER, investments.ORIGIN, investments.SEQUENCE";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getInvestment', err);
                console.error(rtn);
                res.status(rtn.code).send({
                    message: rtn.message,
                });
                return;
            }
            result = JSON.stringify(result);
            res.send(result);
        });
    }
    catch (error) {
        const err = (0, exception_1.default)(100, error.code, 'bachend.getInvestment', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// GET ALL INVESTMENTS
// Route: https://localhost/getAllInvestments
//
router.route('/getAllInvestments').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // cipher validation
    var auth = req.headers['auth'];
    if (auth != hash) {
        res.status(401).send({
            message: 'Unauthorized Request',
        });
        return;
    }
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    var result = yield investments.readAllInvestments();
    return res.send(result);
}));
//
// SIMULATE INVESTMENTS GAINS
// Route: https://localhost/getInvestmentsSimulation/[TotalDays]
//
router.route('/getInvestmentsSimulation/:TotalDays/:saveRecord').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // cipher validation
    var auth = req.headers['auth'];
    if (auth != hash) {
        res.status(401).send({
            message: 'Unauthorized Request',
        });
        return;
    }
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    var saveRecord = (req.params.saveRecord === 'true');
    var earningsCalculations = new earningscalculations_1.EarningsCalculations();
    let totalDays = parseInt(req.params.TotalDays);
    var result = yield earningsCalculations.Simulate(totalDays, saveRecord);
    return res.send(result);
}));
//
// GET INVESTMENTS TRANSACTIONS
// Route: https://localhost/getInvestmentsTransactions
//
router.route('/getInvestmentsTransactions').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // cipher validation
    var auth = req.headers['auth'];
    if (auth != hash) {
        res.status(401).send({
            message: 'Unauthorized Request',
        });
        return;
    }
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    var result = yield investments.readAllMainInvestments();
    return res.send(result);
}));
//
// GET PAYMENTS FROM DATE
// Route: https://localhost/getPayments/[DateFrom]
//
router.route('/getPayments/:DateFrom').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // cipher validation
    var auth = req.headers['auth'];
    if (auth != hash) {
        res.status(401).send({
            message: 'Unauthorized Request',
        });
        return;
    }
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    try {
        var sqlStr = "SELECT investments.*, customers.NAMES FROM investments " +
            "LEFT JOIN customers ON customers.CODE = investments.CUSTOMER " +
            "WHERE investments.TRANSACTIONTYPE = 1 AND investments.STATUS < 2 AND investments.CREATION >= '" + req.params.DateFrom + "'" +
            "ORDER BY investments.CUSTOMER, investments.ORIGIN, investments.SEQUENCE";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getAllCustomers', err);
                console.error(rtn);
                res.status(rtn.code).send({
                    message: rtn.message,
                });
                return;
            }
            result = JSON.stringify(result);
            res.send(result);
        });
    }
    catch (error) {
        const err = (0, exception_1.default)(100, error.code, 'bachend.getAllCustomers', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
//
// ADD TIS TO ALL PAYMENTS
// Route: https://localhost/updatePaymentsTIN/[TINCode]
//
router.route('/updatePaymentsTIN/:TINCode').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // cipher validation
    var auth = req.headers['auth'];
    if (auth != hash) {
        res.status(401).send({
            message: 'Unauthorized Request',
        });
        return;
    }
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    var result = yield updatePaymentsTIN(req.params.TINCode, res);
    return res.send(result);
}));
//******************************************************************************************** */
// Updates Payments with no TIN with a TIN
function updatePaymentsTIN(TINCode, res) {
    return new Promise(function (resolve, reject) {
        investments.readAllInvestments().then(function (res) {
            return __awaiter(this, void 0, void 0, function* () {
                var msg = '';
                var updated = false;
                var investmentsJson = JSON.parse(res);
                for (var i = 0; i < investmentsJson.length; i++) {
                    if (investmentsJson[i].TRANSACTIONTYPE == investmentsTransactionTypes.payment && investmentsJson[i].TAXPAYERIDENTIFICATIONNUMBER == '') {
                        var result = yield tin.createNewTIN(TINCode, res); // Generates new TIN of TINCode
                        if (result != undefined && typeof result == 'string') {
                            var tinJson = JSON.parse(result);
                            var tinCounter = tinJson[0].COUNTER;
                            var tinMinimun = tinJson[0].COUNTERTO - tinCounter;
                            if (tinCounter >= tinJson[0].COUNTERTO) {
                                msg = '231 - Out Of Numbers';
                            }
                            else if (tinJson[0].MINIMUM >= tinMinimun) {
                                msg = '230 - Running Out Of Numbers';
                            }
                            var tinNumber = tin.formatTIN(TINCode, tinCounter);
                            var code = investmentsJson[i].CODE.toString();
                            var sqlStr = 'UPDATE investments SET TAXPAYERIDENTIFICATIONNUMBER = "' + tinNumber + '" WHERE CODE = ' + code + ';';
                            db.query(sqlStr, function (err, result) {
                                if (err) {
                                    const rtn = (0, exception_1.default)(100, err.code, 'bachend.updatePaymentsTIN', err);
                                    console.error(rtn);
                                    const response = {
                                        message: rtn.message,
                                        code: code
                                    };
                                    res.status(rtn.code).send(JSON.stringify(response));
                                    return;
                                }
                                updated = true;
                            });
                        }
                    }
                }
                if (!updated) {
                    msg = '204 - No Data Found';
                }
                else if (msg == '') {
                    msg = '200 - Successful Transaction';
                }
                resolve(msg);
            });
        });
    });
}
module.exports = router;
