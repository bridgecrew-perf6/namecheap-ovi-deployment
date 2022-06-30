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
// GET CUSTOMER MOVEMENTS FROM PERIOD
// Route: https://localhost/getCustomerMovements/[customer]
//
router.route('/getCustomerMovements/:customer').get((req, res) => {
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
        // var sqlStr = "SELECT * FROM credits"+
        //              " LEFT JOIN creditincrease ON credits.CODE = creditincrease.CREDITCODE"+
        //              " LEFT JOIN debits ON credits.CODE = debits.CREDITCODE"+        
        //              " WHERE credits.customer = "+req.params.customer;
        var sqlStr = "SELECT credits.CODE, credits.CUSTOMER, credits.INITIALCREDIT, credits.CREDITINCREASES, credits.INTERESTS, " +
            "       credits.DEBITS, credits.TRANSFERS, credits.FEES, credits.CREATION, credits.USERMODIFIED, " +
            "       credits.CANCELLED, credits.STATUS, " +
            "       creditincrease.CODE AS 'ci.CODE', creditincrease.AMOUNT AS 'ci.AMOUNT', creditincrease.FEE AS 'ci.FEE', creditincrease.STATUS AS 'ci.STATUS', " +
            "       debits.CODE AS 'db.CODE', debits.AMOUNT AS 'db.AMOUNT', debits.FEE AS 'db.FEE', debits.STATUS AS 'db.STATUS' " +
            "FROM credits " +
            "LEFT JOIN creditincrease ON credits.CODE = creditincrease.CREDITCODE " +
            "LEFT JOIN debits ON credits.CODE = debits.CREDITCODE " +
            "WHERE credits.CUSTOMER = " + req.params.customer;
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getCustomerMovements', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getCustomerMovements', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
module.exports = router;
