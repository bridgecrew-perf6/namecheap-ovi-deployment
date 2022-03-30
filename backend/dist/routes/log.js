"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exception_1 = __importDefault(require("../utils/exception"));
const router = require('express').Router();
const hash = require('../utils/encryption');
//
// INSERT LOG
// Route: https://localhost/createLog
//
router.route('/createLog').post((req, res) => {
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
    const err = (0, exception_1.default)(req.body.PRIORITY, req.body.CODE, req.body.TAG, req.body.MSG);
    err.hostname = req.body.HOSTNAME;
    err.executeLog;
    // console.error(err);    
    res.status(200).send({
        message: "Successful Transaction",
    });
});
//
//
// Route: https://localhost/getLogs
//
router.route('/getLogs/:dateTime').get((req, res) => {
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
        const spawn = require('child_process').spawnSync;
        let result = '';
        let arg1 = req.params.dateTime;
        if (process.platform == 'win32') {
            result = spawn('findstr', [arg1, 'ovi.log']).stdout.toString(); //.replace('\n', '');
        }
        else {
            result = spawn('grep', ['--after-context=9999999999', arg1, 'ovi.log']).output.toString(); //.replace('\n', '');
        }
        // console.log(result)
        res.send(result);
    }
    catch (error) {
        const err = (0, exception_1.default)(100, error.code, 'bachend.getAllEmployees', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
function grepWithShell(arg1, done) {
}
;
module.exports = router;
