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
// INSERT TRANSFER
// Route: https://localhost/createTransfer
//
router.route('/createTransfer').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var sqlStr = "INSERT INTO transfers (CODE, CREDITCODE, CUSTOMER, CUSTOMERTO, CREDITSELECTION, AMOUNT, FEE, " +
            "CREDITCODETO, REQUESTCODE, CREATION, USERMODIFIED, MODIFICATION, STATUS) VALUES ?";
        var values = [
            [req.body.CODE, req.body.CREDITCODE, req.body.CUSTOMER, req.body.CUSTOMERTO, req.body.CREDITSELECTION, req.body.AMOUNT, req.body.FEE,
                req.body.CREDITCODETO, req.body.REQUESTCODE, req.body.CREATION, req.body.USERMODIFIED, req.body.MODIFICATION, req.body.STATUS]
        ];
        db.query(sqlStr, [values], function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.createTransfer', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.createTransfer', error);
        console.error(error);
        res.status(err.code).send({
            "message": err.message,
        });
        return;
    }
}));
//
// UPDATE TRANSFER
// Route: https://localhost/updateTransfer
//
router.route('/updateTransfer').post((req, res) => {
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
        var sqlStr = "UPDATE transfers SET " +
            "AMOUNT = " + req.body.AMOUNT + ", " +
            "FEE = " + req.body.FEE + ", " +
            "USERMODIFIED = '" + req.body.USERMODIFIED + "', " +
            "MODIFICATION = '" + req.body.MODIFICATION + "'" +
            " WHERE CODE = " + req.body.CODE;
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateTransfer', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateTransfer', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// UPDATE TRANSFER STATUS
// Route: https://localhost/updateTransferStatus
//
router.route('/updateTransferStatus').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var sqlStr = "UPDATE transfers SET " +
            "STATUS = " + req.body.STATUS + ", " +
            "USERMODIFIED = '" + req.body.USERMODIFIED + "', " +
            "MODIFICATION = '" + req.body.MODIFICATION + "'" +
            " WHERE CODE = " + req.body.CODE;
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateTransferStatus', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateTransferStatus', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
//
// GET TRANSFERS FROM DATE
// Route: https://localhost/getCreditSelectionChanges/[DateFrom]
//
router.route('/getTransfers/:DateFrom').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var sqlStr = "SELECT transfers.*, customers.NAMES FROM transfers " +
            "LEFT JOIN customers ON customers.CODE = transfers.CUSTOMER " +
            "WHERE transfers.STATUS < 2 AND transfers.CREATION >= '" + req.params.DateFrom + "'" +
            "ORDER BY transfers.CUSTOMER";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getTransfers', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getTransfers', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
//
// GET RECENT TRANSFERS
// Route: https://localhost/getRecentCreditSelectionChanges/[customer]
//
router.route('/getRecentTransfers/:customer/:limit').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var sqlStr = "SELECT * FROM transfers WHERE CREATION > now() - interval " + limit + " minute AND STATUS < 2 AND CUSTOMER = " + req.params.customer;
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getRecentTransfers', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getRecentTransfers', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
//
// GET RECENT TRANSFERS BY CREDIT CODE
// Route: https://localhost/getRecentCreditSelectionChangesByCreditCode/[creditCode]
//
router.route('/getRecentTransfersByCreditCode/:creditCode').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var sqlStr = "SELECT * FROM transfers WHERE CREDITCODE = " + req.params.creditCode + " ORDER BY CREATION DESC LIMIT 30";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getRecentTransfersByCreditCode', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getRecentTransfersByCreditCode', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
module.exports = router;
