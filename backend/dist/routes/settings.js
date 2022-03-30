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
// INSERT SETTINGS
// Route: https://localhost/createSettings
//
router.route('/createSettings').post((req, res) => {
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
        var sqlStr = "INSERT INTO settings (CODE, DATA) VALUES ?";
        var values = [
            [req.body.CODE, req.body.DATA]
        ];
        db.query(sqlStr, [values], function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.createSettings', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.createSettings', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
});
//
// UPDATE SETTINGS
// Route: https://localhost/updateSettings
//
router.route('/updateSettings').post((req, res) => {
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
        var sqlStr = "UPDATE settings SET " +
            "DATA = '" + req.body.DATA + "'" +
            " WHERE CODE = '" + req.body.CODE + "'";
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateSettings', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateSettings', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// GET SETTINGS
// Route: https://localhost/getSettings/[code]
//
router.route('/getSettings/:code').get((req, res) => {
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
        var sqlStr = "SELECT * FROM settings WHERE code = '" + req.params.code + "'";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getSettings', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getSettings', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
module.exports = router;
