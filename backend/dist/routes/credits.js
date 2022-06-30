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
const credits = require("../services/credits");
//
// INSERT CREDIT
// Route: https://localhost/createCredit
//
router.route('/createCredit').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var result = yield credits.createCredit(req.body.CODE, req.body.CUSTOMER, req.body.CREDITSELECTION, req.body.INITIALCREDIT, req.body.CREDITINCREASES, req.body.INTERESTS, req.body.DEBITS, req.body.TRANSFERS, req.body.FEES, req.body.FEESCHANGES, req.body.CREATION, req.body.USERMODIFIED, req.body.MODIFICATION, req.body.SEQUENCE, req.body.STATUS);
        return res.send(result);
    }
    catch (error) {
        const err = (0, exception_1.default)(100, error.code, 'bachend.createCredit', error);
        console.error(error);
        res.status(err.code).send({
            "message": err.message,
        });
    }
}));
//
// UPDATE CREDIT
// Route: https://localhost/updateCredit
//
router.route('/updateCredit').post((req, res) => {
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
        var sqlStr = "UPDATE credits SET " +
            "CREDITSELECTION = " + req.body.CREDITSELECTION + ", " +
            "INITIALCREDIT = " + req.body.INITIALCREDIT + ", " +
            "USERMODIFIED = '" + req.body.USERMODIFIED + "', " +
            "MODIFICATION = '" + req.body.MODIFICATION + "'" +
            " WHERE CODE = " + req.body.CODE;
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateCredit', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateCredit', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// UPDATES CREDIT CREDITINCREASES, INTERESTS, DEBITS, TRANSFERS, FEES, FEECHANGES, STATUS
// Route: https://localhost/updateCreditProcess
//
router.route('/updateCreditProcess').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var result = yield credits.updateCreditProcess(req.body.CODE, req.body.CREDITSELECTION, req.body.CREDITINCREASES, req.body.INTERESTS, req.body.DEBITS, req.body.TRANSFERS, req.body.FEES, req.body.FEESCHANGES, req.body.STATUS);
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
// UPDATE CREDIT STATUS
// Route: https://localhost/updateCreditStatus
//
router.route('/updateCreditStatus').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var result = yield credits.updateCreditStatus(req.body.CODE, req.body.STATUS, req.body.USERMODIFIED, req.body.MODIFICATION);
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
// GET CREDTIS OF A CUSTOMER
// Route: https://localhost/getCredits/[code]
//
router.route('/getCredits/:code').get((req, res) => {
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
        var sqlStr = "SELECT * FROM credits WHERE customer = '" + req.params.code + "' " +
            "ORDER BY credits.CODE";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getCredits', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getCredits', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// GET SPECIFIC CREDIT
// Route: https://localhost/getSpecificCredit/[code]
//
router.route('/getSpecificCredit/:code').get((req, res) => {
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
        var sqlStr = "SELECT * FROM credits WHERE code = " + req.params.code;
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getSpecificCredit', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getSpecificCredit', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// GET ALL INVESTMENTS
// Route: https://localhost/getAllCredits
//
router.route('/getAllCredits').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    var result = yield credits.readAllCredits();
    return res.send(result);
}));
//
// GET CREDTIS TRANSACTIONS
// Route: https://localhost/getCreditsTransactions
//
router.route('/getCreditsTransactions').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    var result = yield credits.readAllCredits();
    return res.send(result);
}));
module.exports = router;
