"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exception_1 = __importDefault(require("../utils/exception"));
const router = require('express').Router();
const hash = require('../utils/encryption');
const db = require('../utils/db');
//
// INSERT CUSTOMER
// Route: https://localhost/createCustomer
//
router.route('/createCustomer').post((req, res) => {
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
        var sqlStr = "INSERT INTO customers (CODE, NAMES, ID, TYPE, COMMERCIALREG, " +
            "LEGALREPRESENT, REFERENCEDBY, EMAIL, ADDRESS, PHONENUMBER, " +
            "BRANCH, BANK, BANKACCOUNTNUMBER, BANKACCOUNTOWNER, " +
            "BANKACCOUNTTYPE, BANKACCOUNTCURRENCY, CREATION, USERMODIFIED, " +
            "MODIFICATION, STATUS) VALUES ?";
        var values = [
            [req.body.CODE, req.body.NAMES, req.body.ID, req.body.TYPE, req.body.COMMERCIALREG,
                req.body.LEGALREPRESENT, req.body.REFERENCEDBY, req.body.EMAIL, req.body.ADDRESS, req.body.PHONENUMBER,
                req.body.BRANCH, req.body.BANK, req.body.BANKACCOUNTNUMBER, req.body.BANKACCOUNTOWNER,
                req.body.BANKACCOUNTTYPE, req.body.BANKACCOUNTCURRENCY, req.body.CREATION, req.body.USERMODIFIED,
                req.body.MODIFICATION, req.body.STATUS]
        ];
        db.query(sqlStr, [values], function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.createCustomer', err);
                console.error(rtn);
                res.status(rtn.code).send({
                    message: rtn.message,
                });
                return;
            }
            sqlStr = 'SELECT LAST_INSERT_ID()';
            db.query(sqlStr, function (err, result) {
                if (err) {
                    const rtn = (0, exception_1.default)(100, err.code, 'bachend.createCustomer', err);
                    console.error(rtn);
                    res.status(rtn.code).send({
                        message: rtn.message,
                    });
                    return;
                }
                var msg = '"code": ' + result[0]['LAST_INSERT_ID()'] + ', "message": "Successful Transaction"';
                res.status(200).send({
                    message: msg
                });
            });
        });
    }
    catch (error) {
        const err = (0, exception_1.default)(100, error.code, 'bachend.createCustomer', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// UPDATE CUSTOMER
// Route: https://localhost/updateCustomer
//
router.route('/updateCustomer').post((req, res) => {
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
        var sqlStr = "UPDATE customers SET " +
            "NAMES = '" + req.body.NAMES + "', " +
            "ID = '" + req.body.ID + "', " +
            "TYPE = '" + req.body.TYPE + "', " +
            "COMMERCIALREG = '" + req.body.COMMERCIALREG + "', " +
            "LEGALREPRESENT = '" + req.body.LEGALREPRESENT + "', " +
            "REFERENCEDBY = '" + req.body.REFERENCEDBY + "', " +
            "EMAIL = '" + req.body.EMAIL + "', " +
            "ADDRESS = '" + req.body.ADDRESS + "', " +
            "PHONENUMBER = '" + req.body.PHONENUMBER + "', " +
            "BRANCH = '" + req.body.BRANCH + "', " +
            "BANK = '" + req.body.BANK + "', " +
            "BANKACCOUNTNUMBER = '" + req.body.BANKACCOUNTNUMBER + "', " +
            "BANKACCOUNTOWNER = '" + req.body.BANKACCOUNTOWNER + "', " +
            "BANKACCOUNTTYPE = '" + req.body.BANKACCOUNTTYPE + "', " +
            "BANKACCOUNTCURRENCY = '" + req.body.BANKACCOUNTCURRENCY + "', " +
            "USERMODIFIED = '" + req.body.USERMODIFIED + "', " +
            "MODIFICATION = '" + req.body.MODIFICATION + "', " +
            "STATUS = " + req.body.STATUS +
            " WHERE CODE = '" + req.body.CODE + "'";
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateCustomer', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateCustomer', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
//
// Route: https://localhost/getAllCustomers
//
router.route('/getAllCustomers/:orderBy').get((req, res) => {
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
        var orderBy = 'CODE';
        if (req.params.orderBy == 'customerType') {
            var orderBy = 'TYPE';
        }
        else if (req.params.orderBy == 'referencedBy') {
            var orderBy = 'REFERENCEDBY';
        }
        var sqlStr = "SELECT * FROM customers ORDER BY " + orderBy;
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
});
//
//
// Route: https://localhost/getCustomersCount
//
router.route('/getCustomersCount').get((req, res) => {
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
        var sqlStr = "SELECT COUNT(*) FROM customers";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getCustomersCount', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getCustomersCount', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// GET CUSTOMER BY ID
// Route: https://localhost/getCustomer/[customerID]
//
router.route('/getCustomerByID/:customerID').get((req, res) => {
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
        var sqlStr = "SELECT * FROM customers WHERE id = '" + req.params.customerID + "'";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getCustomerByID', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getCustomerByID', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
module.exports = router;
