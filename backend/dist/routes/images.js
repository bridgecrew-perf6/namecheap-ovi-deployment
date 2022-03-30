"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exception_1 = __importDefault(require("../utils/exception"));
const router = require('express').Router();
const hash = require('../utils/encryption');
const db = require('../utils/db');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//
// INSERT IMAGE
// Route: https://localhost/createImage
//
router
    .route('/createImage')
    .post((req, res, next) => {
    upload.single('image')(req, res, function (error) {
        if (error) {
            const err = (0, exception_1.default)(100, error.code, 'bachend.createImage', error);
            console.error(error);
            res.status(err.code).send({
                message: err.message,
            });
        }
        else {
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
            // Validate request
            if (!req.file) {
                res.status(400).send({
                    message: "Content can not be empty!",
                });
                return;
            }
            try {
                var imageName = req.body['name'];
                var sqlStr = "INSERT INTO images SET ?";
                var values = {
                    CODE: imageName,
                    IMAGE: req.file.buffer
                };
                db.query(sqlStr, [values], function (err, result) {
                    if (err) {
                        const rtn = (0, exception_1.default)(100, err.code, 'bachend.createImage', err);
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
                const err = (0, exception_1.default)(100, error.code, 'bachend.createImage', error);
                console.error(error);
                res.status(err.code).send({
                    message: err.message,
                });
                // expected output: ReferenceError: nonExistentFunction is not defined
                // Note - error messages will vary depending on browser
            }
        }
    });
});
//
// UPDATE IMAGE
// Route: https://localhost/updateImage
//
router
    .route('/updateImage')
    .post((req, res, next) => {
    upload.single('image')(req, res, function (error) {
        if (error) {
            const err = (0, exception_1.default)(100, error.code, 'bachend.updateImage', error);
            console.error(error);
            res.status(err.code).send({
                message: err.message,
            });
        }
        else {
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
            // Validate request
            if (!req.file) {
                res.status(400).send({
                    message: "Content can not be empty!",
                });
                return;
            }
            try {
                var imageName = req.body['name'];
                var sqlStr = "UPDATE images SET IMAGE = ? WHERE CODE = '" + imageName + "'";
                let obj = req.file.buffer;
                db.query(sqlStr, [obj], function (err, result) {
                    if (err) {
                        const rtn = (0, exception_1.default)(100, err.code, 'bachend.updateImage', err);
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
                const err = (0, exception_1.default)(100, error.code, 'bachend.updateImage', error);
                console.error(error);
                res.status(err.code).send({
                    message: err.message,
                });
                // expected output: ReferenceError: nonExistentFunction is not defined
                // Note - error messages will vary depending on browser
            }
        }
    });
});
//
// GET IMAGE BY CODE
// Route: https://localhost/getImage/[imageCODE]
//
router.route('/getImage/:imageCODE').get((req, res) => {
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
        var sqlStr = "SELECT * FROM images WHERE code = '" + req.params.imageCODE + "'";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getImage', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getImage', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// GET IMAGE BY PRFIX
// Route: https://localhost/getImagesByPrefix/[imagePrefix]
//
router.route('/getImagesByPrefix/:imagePrefix').get((req, res) => {
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
        var sqlStr = "SELECT * FROM images WHERE code LIKE '" + req.params.imagePrefix + "%'";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.getImagesByPrefix', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.getImagesByPrefix', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
//
// DELETE IMAGE BY CODE
// Route: https://localhost/deleteImage/[imageCODE]
//
router.route('/deleteImage/:imageCODE').delete((req, res) => {
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
        var sqlStr = "DELETE FROM images WHERE code = '" + req.params.imageCODE + "'";
        db.query(sqlStr, function (err, result, fields) {
            if (err) {
                const rtn = (0, exception_1.default)(100, err.code, 'bachend.deleteImage', err);
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
        const err = (0, exception_1.default)(100, error.code, 'bachend.deleteImage', error);
        console.error(error);
        res.status(err.code).send({
            message: err.message,
        });
    }
});
module.exports = router;
