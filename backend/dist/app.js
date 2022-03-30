"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require('https');
// const http = require('http');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const app = express();
const cors = require('cors');
const path = require('path');
const routeServer = require('./routes/server');
const routeSettings = require('./routes/settings');
const routeInvestments = require('./routes/investments');
const routeCustomers = require('./routes/customers');
const routeUsers = require('./routes/users');
const routeEmployees = require('./routes/employees');
const routeImages = require('./routes/images');
const routeTIN = require('./routes/tin');
const routeLog = require('./routes/log');
const earningscalculations_1 = require("./services/earningscalculations");
const certPath = './certs';
var port = process.env.PORT || 443;
// Certificates declaration
var httpsOptions = {
    key: fs.readFileSync(path.join(certPath, 'privateKey.key')),
    cert: fs.readFileSync(path.join(certPath, 'certificate.pem'))
};
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
if (process.env.NODE_ENV === 'development') {
    port = 8200; // Set Port for Web Mode
    app.set('port', port);
}
// // Implementing CSP (Content Security Policy)
// app.use(function (req: any, res: any, next: any) {
//     res.setHeader(
//       'Content-Security-Policy-Report-Only',
//       "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
//     );
//     next();
// });
// Execute Job every day at (3am)
const cron = require("node-cron");
const appinit_1 = require("./services/appinit");
cron.schedule('0 0 3 * * *', () => {
    let datetime = new Date();
    let appInit = new appinit_1.AppInit();
    console.log('Earnings Calculation Process Executed At: ' + appInit.SQLDateTime(datetime));
    var earningsCalculations = new earningscalculations_1.EarningsCalculations();
    earningsCalculations.Execute(true);
    //    earningsCalculations.Simulate(90, true);    
});
//// Define Cross-origin resource sharing
// app.use(cors({
//    origin: ["http://localhost:8200", "http://127.0.0.1:8200", "http://localhost", "https://localhost:8200", "https://localhost", "http://localhost:53882"],
//    credentials: true,
// }));
app.use(cors());
// Securing html header with helmet
app.use(helmet());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// Set routes
app.use('/', routeServer);
app.use('/', routeSettings);
app.use('/', routeInvestments);
app.use('/', routeCustomers);
app.use('/', routeUsers);
app.use('/', routeEmployees);
app.use('/', routeImages);
app.use('/', routeTIN);
app.use('/', routeLog);
// Starts https Server
// =============================================================================
if (process.env.NODE_ENV === 'development') {
    if (port == 443) {
        https.createServer(httpsOptions, app).listen(app.get('port'), function () {
            console.log('HTTPS server listening on port ' + app.get('port'));
        });
    }
    else {
        app.listen(port, () => {
            console.log('HTTP server listening on port ' + app.get('port'));
        });
    }
}
else {
    app.listen();
}
console.log('');
