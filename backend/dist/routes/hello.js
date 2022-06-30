"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
//
// HELLO WORLD
// Route: https://localhost/helloWorld
//
router.route('/helloWorld').get((req, res) => {
    console.log('Hellow World');
    res.status(200).send({
        message: "Successful Transaction",
    });
});
module.exports = router;
