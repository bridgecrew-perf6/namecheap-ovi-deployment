"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require('https');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const app = express();
const cors = require('cors');
const path = require('path');
const routeServer = require('./routes/server');
const routeSettings = require('./routes/settings');
const routeCredits = require('./routes/credits');
const routeDebits = require('./routes/debits');
const routeInterests = require('./routes/interests');
const routeCreditIncrease = require('./routes/creditincrease');
const routeCustomers = require('./routes/customers');
const routeUsers = require('./routes/users');
const routeEmployees = require('./routes/employees');
const routeImages = require('./routes/images');
//const routeTIN = require('./routes/tin');
const routeLog = require('./routes/log');
const routeRequests = require('./routes/requests');
const routeDistributionRate = require('./routes/distributionrate');
const routeInterestsCalculation = require('./routes/interestscalculation');
const routeQueries = require('./routes/queries');
const routeHello = require('./routes/hello');
const routeIDValidation = require('./routes/idvalidation');
const routeCreditSelectionChanges = require('./routes/creditselectionchanges');
const routeTransfers = require('./routes/transfers');
const routeMail = require('./routes/mail');
const earningscalculations_1 = require("./services/earningscalculations");
require('dotenv').config();
const certPath = './certs';
var port = process.env.PORT || 443;
var host = process.env.HOST || 'localhost';
// Certificates declaration
var httpsOptions = {
    key: fs.readFileSync(path.join(certPath, 'privateKey.key')),
    cert: fs.readFileSync(path.join(certPath, 'certificate.pem'))
};
if (process.env.NODE_ENV === 'development') {
    port = 8200; // Set Port for Web Mode
}
app.enable('trust proxy');
app.set('port', port);
app.set('host', host);
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
// Console Log
app.use(function (req, res, next) {
    if (process.env.LOG === 'true') {
        var url = req.protocol + "://" + req.get('host') + req.originalUrl;
        console.log('Log: ' + url);
    }
    return next();
});
app.use(cors());
// Securing html header with helmet
app.use(helmet());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// Set routes
app.use('/', routeServer);
app.use('/', routeSettings);
app.use('/', routeCredits);
app.use('/', routeDebits);
app.use('/', routeInterests);
app.use('/', routeCreditIncrease);
app.use('/', routeCustomers);
app.use('/', routeUsers);
app.use('/', routeEmployees);
app.use('/', routeImages);
//app.use('/', routeTIN);
app.use('/', routeLog);
app.use('/', routeRequests);
app.use('/', routeDistributionRate);
app.use('/', routeInterestsCalculation);
app.use('/', routeQueries);
app.use('/', routeHello);
app.use('/', routeIDValidation);
app.use('/', routeCreditSelectionChanges);
app.use('/', routeTransfers);
app.use('/', routeMail);
if (process.env.TABLES === 'true') {
    const all_routes = require('express-list-endpoints');
    console.log(all_routes(app));
}
// Starts https Server
// =============================================================================
console.log('------------------------------------------------------');
console.log('  Mode: ' + process.env.NODE_ENV);
console.log('  Logs: ' + process.env.LOG);
console.log('Tables: ' + process.env.TABLES);
console.log('  Host: ' + app.get('host'));
console.log('  Port: ' + app.get('port'));
console.log('------------------------------------------------------');
if (process.env.NODE_ENV === 'development') {
    app.listen(app.get('port'), app.get('host'), () => {
        console.log('HTTP server listening on port ' + app.get('port'));
    });
}
else {
    app.listen(app.get('port'), app.get('host'), () => {
        console.log('HTTP server listening on port ' + app.get('port'));
    });
}
