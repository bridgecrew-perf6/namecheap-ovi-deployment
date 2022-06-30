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
// INSERT REQUEST
// Route: https://localhost/createRequest
//
router.route('/createRequest').post((req, res) => {
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
        var sqlStr = "INSERT INTO requests (CODE, CREDITCODE, CREDITSELECTIONFROM, CREDITSELECTION, CUSTOMER, CUSTOMERTO, " +
            "AMOUNT, REQUESTTYPE, COMMENT, CREATION, USERMODIFIED, MODIFICATION, STATUS) VALUES ?";
        var values = [
            [req.body.CODE, req.body.CREDITCODE, req.body.CREDITSELECTIONFROM, req.body.CREDITSELECTION, req.body.CUSTOMER, req.body.CUSTOMERTO,
                req.body.AMOUNT, req.body.REQUESTTYPE, req.body.COMMENT, req.body.CREATION, req.body.USERMODIFIED, req.body.MODIFICATION, req.body.STATUS]
        ];
        db.query(sqlStr, [values], function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.createRequest', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.createRequest', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
});
//
// UPDATE REQUEST
// Route: https://localhost/updateRequest
//
router.route('/updateRequest').post((req, res) => {
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
        var sqlStr = "UPDATE requests SET " +
            "CREDITSELECTION = '" + req.body.CREDITSELECTION + "', " +
            "AMOUNT = '" + req.body.AMOUNT + "', " +
            "COMMENT = '" + req.body.COMMENT + "', " +
            "USERMODIFIED = '" + req.body.USERMODIFIED + "', " +
            "MODIFICATION = '" + req.body.MODIFICATION + "', " +
            "STATUS = " + req.body.STATUS +
            " WHERE code = " + req.body.CODE;
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateRequest', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateRequest', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// UPDATE REQUEST STATUS
// Route: https://localhost/updateRequestStatus
//
router.route('/updateRequestStatus').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var sqlStr = "UPDATE requests SET " +
            "STATUS = " + req.body.STATUS + ", " +
            "USERMODIFIED = '" + req.body.USERMODIFIED + "', " +
            "MODIFICATION = '" + req.body.MODIFICATION + "'" +
            " WHERE CODE = " + req.body.CODE;
        db.query(sqlStr, function (err, result) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateRequestStatus', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.updateRequestStatus', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
}));
//
// GET REQUESTS
// Route: https://localhost/getPendingRequests[customerCode, actionm, limit]
//
router.route('/getPendingRequests/:customerCode/:action/:limit').get((req, res) => {
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
        var sqlStr = '';
        var limit = req.params.limit;
        if (limit == '0' || limit == '') {
            limit = '120';
        }
        if (req.params.customerCode == '0') {
            if (req.params.action == 'INPROCESS') {
                sqlStr = "SELECT * FROM requests WHERE status < 4";
            }
            else if (req.params.action == 'APPROVED') {
                sqlStr = "SELECT * FROM requests WHERE status = 3";
            }
            else if (req.params.action == 'PENDING') {
                sqlStr = "SELECT * FROM requests WHERE status = 0";
            }
            else {
                // sqlStr = "SELECT * FROM requests WHERE (status = 3 OR status = 6) AND (creation > NOW() - INTERVAL "+limit+" HOUR)";
                sqlStr = "SELECT * FROM requests WHERE (status = 3 OR status = 6)";
            }
        }
        else {
            if (req.params.action == 'INPROCESS') {
                //sqlStr = "SELECT * FROM requests WHERE customer = "+req.params.customerCode+" AND status < 4";
                sqlStr = "SELECT * FROM requests WHERE (customer = " + req.params.customerCode + ") AND (status < 4 OR status = 6) AND (creation > NOW() - INTERVAL " + limit + " HOUR)";
            }
            else if (req.params.action == 'APPROVED') {
                sqlStr = "SELECT * FROM requests WHERE customer = " + req.params.customerCode + " AND status = 3";
            }
            else if (req.params.action == 'PENDING') {
                sqlStr = "SELECT * FROM requests WHERE customer = " + req.params.customerCode + " AND status = 0";
            }
            else {
                // sqlStr = "SELECT * FROM requests WHERE customer = "+req.params.customerCode+" AND (status = 3 OR status = 6)  AND (creation > NOW() - INTERVAL "+limit+" HOUR)";
                sqlStr = "SELECT * FROM requests WHERE customer = " + req.params.customerCode + " AND (status = 3 OR status = 6)";
            }
        }
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getRequests', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getRequests', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
});
module.exports = router;
