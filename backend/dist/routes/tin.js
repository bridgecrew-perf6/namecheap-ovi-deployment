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
// INSERT TIN
// Route: https://localhost/createTIN
//
router.route('/createTIN').post((req, res) => {
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
        var sqlStr = "INSERT INTO tin (CODE, COUNTER, COUNTERFROM, COUNTERTO, MINIMUM, " +
            "CREATION, USERMODIFIED, MODIFICATION) VALUES ?";
        var values = [
            [req.body.CODE, req.body.COUNTER, req.body.COUNTERFROM, req.body.COUNTERTO, req.body.MINIMUM,
                req.body.CREATION, req.body.USERMODIFIED, req.body.MODIFICATION]
        ];
        db.query(sqlStr, [values], function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.createTIN', err);
                console.error(rtn);
                res.status(rtn.code).send({
                    message: rtn.message,
                });
                return;
            }
            res.status(200).send({
                message: "Successful Transaction",
            });
            // console.log("Number of records inserted: " + result.affectedRows);
        });
    }
    catch (error) {
        const err = (0, exception_1.default)(100, error.code, 'bachend.createTIN', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
});
//
// UPDATE USER
// Route: https://localhost/updateTIN
//
router.route('/updateTIN').post((req, res) => {
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
        var sqlStr = "UPDATE tin SET " +
            "COUNTER = '" + req.body.COUNTER + "', " +
            "COUNTERFROM = '" + req.body.COUNTERFROM + "', " +
            "COUNTERTO = '" + req.body.COUNTERTO + "', " +
            "MINIMUM = '" + req.body.MINIMUM + "', " +
            "USERMODIFIED = '" + req.body.USERMODIFIED + "', " +
            "MODIFICATION = '" + req.body.MODIFICATION + "'" +
            " WHERE code = '" + req.body.CODE + "'";
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateTIN', err);
                console.error(rtn);
                res.status(rtn.code).send({
                    message: rtn.message,
                });
                return;
            }
            res.status(200).send({
                message: "Successful Transaction",
            });
            // console.log("Number of records inserted: " + result.affectedRows);
        });
    }
    catch (error) {
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateTIN', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
// READ TIN BY CODE
//
// Route: https://localhost/getTIN/[code]
//
router.route('/getTIN/:code').get((req, res) => {
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
        var sqlStr = "SELECT * FROM tin WHERE code = '" + req.params.code + "'";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getTIN', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getTIN', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
module.exports = router;
