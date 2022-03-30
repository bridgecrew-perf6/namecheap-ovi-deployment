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
// INSERT USER
// Route: https://localhost/createUser
//
router.route('/createUser').post((req, res) => {
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
        var sqlStr = "INSERT INTO users (USER, NAMES, TYPE, PASSWORD, ACCESS, BRANCH, " +
            "CREATION, USERMODIFIED, MODIFICATION, STATUS) VALUES ?";
        var values = [
            [req.body.USER, req.body.NAMES, req.body.TYPE, req.body.PASSWORD, req.body.ACCESS, req.body.BRANCH,
                req.body.CREATION, req.body.USERMODIFIED, req.body.MODIFICATION, req.body.STATUS]
        ];
        db.query(sqlStr, [values], function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.createUser', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.createUser', error);
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
// Route: https://localhost/updateUser
//
router.route('/updateUser').post((req, res) => {
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
        var sqlStr = "UPDATE users SET " +
            "NAMES = '" + req.body.NAMES + "', " +
            "TYPE = '" + req.body.TYPE + "', " +
            "PASSWORD = '" + req.body.PASSWORD + "', " +
            "ACCESS = '" + req.body.ACCESS + "', " +
            "BRANCH = '" + req.body.BRANCH + "', " +
            "USERMODIFIED = '" + req.body.USERMODIFIED + "', " +
            "MODIFICATION = '" + req.body.MODIFICATION + "', " +
            "STATUS = " + req.body.STATUS +
            " WHERE user = '" + req.body.USER + "'";
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateUser', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateUser', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// DELETE USER
// Route: https://localhost/deleteUser
//
router.route('/deleteUser').post((req, res) => {
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
        var sqlStr = "DELETE FROM users WHERE user = '" + req.body.USER + "'";
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.deleteUser', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.deleteUser', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
//
// Route: https://localhost/getAllUsers
//
router.route('/getAllUsers').get((req, res) => {
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
        var sqlStr = "SELECT * FROM users";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getAllUsers', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getAllUsers', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
});
//
//
// Route: https://localhost/getUsersCount
//
router.route('/getUsersCount').get((req, res) => {
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
        var sqlStr = "SELECT COUNT(*) FROM users";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getUsersCount', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getUsersCount', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
// GET USER BY CODE
//
// Route: https://localhost/getUser/[usercode]
//
router.route('/getUser/:usercode').get((req, res) => {
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
        var sqlStr = "SELECT * FROM users WHERE user = '" + req.params.usercode + "'";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getUser', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getUser', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
module.exports = router;
