"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const hash = require('../utils/encryption');
const db = require('../utils/db');
//
// Get Server Status.
//
// Route: https://localhost/getServerStatus
//==============================================================================    
router.route('/getServerStatus').get((req, res) => {
    // cipher validation
    var auth = req.headers['auth'];
    if (auth != hash) {
        res.status(401).send('Unauthorized Request');
        return;
    }
    res.sendStatus(200);
});
//****************************************************** */
// EXPORTS
//
// router
//    
module.exports = router;
