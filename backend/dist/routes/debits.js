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
//
// INSERT DEBIT
// Route: https://localhost/createDebit
//
router.route('/createDebit').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var sqlStr = "INSERT INTO debits (CODE, CREDITCODE, CUSTOMER, AMOUNT, FEE, REQUESTCODE, " +
            "CREATION, USERMODIFIED, MODIFICATION, STATUS) VALUES ?";
        var values = [
            [req.body.CODE, req.body.CREDITCODE, req.body.CUSTOMER, req.body.AMOUNT, req.body.FEE, req.body.REQUESTCODE,
                req.body.CREATION, req.body.USERMODIFIED, req.body.MODIFICATION, req.body.STATUS]
        ];
        db.query(sqlStr, [values], function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.createDebit', err);
                console.error(rtn);
                res.status(rtn.code).send({
                    "message": rtn.message,
                });
                return;
            }
            return res.send(result);
        });
    }
    catch (error) {
        const err = (0, exception_1.default)(100, error.code, 'bachend.createDebit', error);
        console.error(error);
        res.status(err.code).send({
            "message": err.message,
        });
        return;
    }
}));
//
// UPDATE DEBIT
// Route: https://localhost/updateDebit
//
router.route('/updateDebit').post((req, res) => {
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
        var sqlStr = "UPDATE debits SET " +
            "AMOUNT = " + req.body.AMOUNT + ", " +
            "FEE = " + req.body.FEE + ", " +
            "USERMODIFIED = '" + req.body.USERMODIFIED + "', " +
            "MODIFICATION = '" + req.body.MODIFICATION + "'" +
            " WHERE CODE = " + req.body.CODE;
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateDebit', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateDebit', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// UPDATE DEBIT STATUS
// Route: https://localhost/updateDebitStatus
//
router.route('/updateDebitStatus').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var sqlStr = "UPDATE debits SET " +
            "STATUS = " + req.body.STATUS + ", " +
            "USERMODIFIED = '" + req.body.USERMODIFIED + "', " +
            "MODIFICATION = '" + req.body.MODIFICATION + "'" +
            " WHERE CODE = " + req.body.CODE;
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateDebitStatus', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateDebitStatus', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
//
// GET DEBITS FROM DATE
// Route: https://localhost/getDebits/[DateFrom]
//
router.route('/getDebits/:DateFrom').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var sqlStr = "SELECT debits.*, customers.NAMES FROM debits " +
            "LEFT JOIN customers ON customers.CODE = debits.CUSTOMER " +
            "WHERE debits.STATUS < 2 AND debits.CREATION >= '" + req.params.DateFrom + "'" +
            "ORDER BY debits.CUSTOMER";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getDebits', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getDebits', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
//
// GET RECENT DEBITS
// Route: https://localhost/getRecentDebits/[customer]
//
router.route('/getRecentDebits/:customer/:limit').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var limit = req.params.limit;
        if (limit == '0' || limit == '') {
            limit = '60';
        }
        var sqlStr = "SELECT * FROM debits WHERE CREATION > now() - interval " + limit + " minute AND STATUS < 2 AND CUSTOMER = " + req.params.customer;
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getRecentDebits', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getRecentDebits', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
//
// GET RECENT DEBITS BY CREDIT CODE
// Route: https://localhost/getRecentDebitsByCreditCode/[creditCode]
//
router.route('/getRecentDebitsByCreditCode/:creditCode').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var sqlStr = "SELECT * FROM debits WHERE CREDITCODE = " + req.params.creditCode + " ORDER BY CREATION DESC LIMIT 30";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getRecentDebitsByCreditCode', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getRecentDebitsByCreditCode', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
module.exports = router;
