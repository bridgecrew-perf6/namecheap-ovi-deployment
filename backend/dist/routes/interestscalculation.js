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
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const hash = require('../utils/encryption');
const earningscalculations_1 = require("../services/earningscalculations");
//
// SIMULATE CREDITS INTERESTS CALCULATIONS
// Route: https://localhost/getInterestsSimulation/[TotalDays]
//
router.route('/getInterestsSimulation/:TotalDays/:saveRecord').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    var saveRecord = (req.params.saveRecord === 'true');
    var earningsCalculations = new earningscalculations_1.EarningsCalculations();
    let totalDays = parseInt(req.params.TotalDays);
    var result = yield earningsCalculations.Simulate(totalDays, saveRecord);
    return res.send(result);
}));
module.exports = router;
