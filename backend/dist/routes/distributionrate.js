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
// INSERT DISTRIBUTION RATE
// Route: https://localhost/createDistributionRate
//
router.route('/createDistributionRate').post((req, res) => {
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
        var sqlStr = "INSERT INTO distributionrate (CREATION, RATE, USERMODIFIED) VALUES ?";
        var values = [
            [req.body.CREATION, req.body.RATE, req.body.USERMODIFIED]
        ];
        db.query(sqlStr, [values], function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.createDistributionRate', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.createDistributionRate', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
});
//
// UPDATE DISTRIBUTION RATE
// Route: https://localhost/updateDistributionRate
//
router.route('/updateDistributionRate').post((req, res) => {
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
        var sqlStr = "UPDATE distributionrate SET " +
            "RATE = " + req.body.RATE + ", " +
            "USERMODIFIED = '" + req.body.USERMODIFIED + "'" +
            " WHERE CREATION = '" + req.body.CREATION + "'";
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateDistributionRate', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateDistributionRate', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// GET DISTRIBUTION RATE
// Route: https://localhost/getDistributionRate/[date]
//
router.route('/getDistributionRate/:date').get((req, res) => {
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
        var sqlStr = "SELECT * FROM distributionrate WHERE creation = '" + req.params.date + "'";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getDistributionRate', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getDistributionRate', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
module.exports = router;
