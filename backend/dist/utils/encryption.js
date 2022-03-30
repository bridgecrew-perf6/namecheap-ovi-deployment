"use strict";
//
// Encryption Module
//
const crypt = require('crypto');
const env = require('dotenv');
// Load .env Variables
env.config();
// Create hash for ssl encryption
const secret = process.env.PASSWORD;
const payload = process.env.PAYLOAD;
const hashing = crypt.createHmac('sha256', secret).update(payload).digest('hex'); // Creating crypto cipher
const filefilter = (req, file, callback) => {
    var auth = req.headers['auth'];
    if (auth != hashing) {
        callback(null, false);
    }
    else {
        callback(null, true);
    }
};
module.exports = hashing;
