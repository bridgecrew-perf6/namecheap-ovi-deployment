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
// INSERT CREDITSELECTIONCHANGE
// Route: https://localhost/createCreditSelectionChange
//
router.route('/createCreditSelectionChange').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var sqlStr = "INSERT INTO creditselectionchanges (CODE, CREDITCODE, CUSTOMER, CREDITSELECTIONFROM, CREDITSELECTIONTO, " +
            "AMOUNT, FEE, REQUESTCODE, CREATION, USERMODIFIED, MODIFICATION, STATUS) VALUES ?";
        var values = [
            [req.body.CODE, req.body.CREDITCODE, req.body.CUSTOMER, req.body.CREDITSELECTIONFROM, req.body.CREDITSELECTIONTO,
                req.body.AMOUNT, req.body.FEE, req.body.REQUESTCODE, req.body.CREATION, req.body.USERMODIFIED, req.body.MODIFICATION, req.body.STATUS]
        ];
        db.query(sqlStr, [values], function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.createCreditSelectionChange', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.createCreditSelectionChange', error);
        console.error(error);
        res.status(err.code).send({
            "message": err.message,
        });
        return;
    }
}));
//
// UPDATE CREDITSELECTIONCHANGE
// Route: https://localhost/updateCreditSelectionChange
//
router.route('/updateCreditSelectionChange').post((req, res) => {
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
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateCreditSelectionChange', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateCreditSelectionChange', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// UPDATE CREDITSELECTIONCHANGE STATUS
// Route: https://localhost/updateCreditSelectionChangeStatus
//
router.route('/updateCreditSelectionChangeStatus').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var sqlStr = "UPDATE creditselectionchanges SET " +
            "STATUS = " + req.body.STATUS + ", " +
            "USERMODIFIED = '" + req.body.USERMODIFIED + "', " +
            "MODIFICATION = '" + req.body.MODIFICATION + "'" +
            " WHERE CODE = " + req.body.CODE;
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateCreditSelectionChangeStatus', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateCreditSelectionChangeStatus', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
//
// GET CREDITSELECTIONCHANGES FROM DATE
// Route: https://localhost/getCreditSelectionChanges/[DateFrom]
//
router.route('/getCreditSelectionChanges/:DateFrom').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var sqlStr = "SELECT creditselectionchanges.*, customers.NAMES FROM creditselectionchanges " +
            "LEFT JOIN customers ON customers.CODE = creditselectionchanges.CUSTOMER " +
            "WHERE creditselectionchanges.STATUS < 2 AND creditselectionchanges.CREATION >= '" + req.params.DateFrom + "'" +
            "ORDER BY creditselectionchanges.CUSTOMER";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getCreditSelectionChanges', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getCreditSelectionChanges', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
//
// GET RECENT CREDITSELECTIONCHANGES
// Route: https://localhost/getRecentCreditSelectionChanges/[customer]
//
router.route('/getRecentCreditSelectionChanges/:customer/:limit').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var sqlStr = "SELECT * FROM creditselectionchanges WHERE CREATION > now() - interval " + limit + " minute AND STATUS < 2 AND CUSTOMER = " + req.params.customer;
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getRecentCreditSelectionChanges', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getRecentCreditSelectionChanges', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
//
// GET RECENT CREDITSELECTIONCHANGES BY CREDIT CODE
// Route: https://localhost/getRecentCreditSelectionChangesByCreditCode/[creditCode]
//
router.route('/getRecentCreditSelectionChangesByCreditCode/:creditCode').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var sqlStr = "SELECT * FROM creditselectionchanges WHERE CREDITCODE = " + req.params.creditCode + " ORDER BY CREATION DESC LIMIT 30";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getRecentCreditSelectionChangesByCreditCode', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getRecentCreditSelectionChangesByCreditCode', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
module.exports = router;
