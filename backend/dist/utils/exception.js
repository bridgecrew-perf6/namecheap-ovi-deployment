"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
var os = require("os");
// Exception Error
class errorExcept {
    constructor(priority, code, tag, message) {
        this.priority = priority;
        this.code = code;
        this.tag = tag;
        this.message = message;
        this.hostname = '';
    }
    // Create Log under RFC5424 Standard
    Log() {
        if (this.hostname == '') {
            this.hostname = os.hostname();
        }
        const date = new Date();
        const formatted = date.toISOString(); // RFC 3339 format
        var msg = '<' + this.priority + '>' + formatted + ' ' + this.hostname + ' ' + this.tag + ': ' + this.message + '\n';
        function closeFd(fd) {
            (0, fs_1.close)(fd, (err) => {
                if (err)
                    throw err;
            });
        }
        (0, fs_1.open)('ovi.log', 'a', (err, fd) => {
            if (err)
                throw err;
            try {
                (0, fs_1.appendFile)(fd, msg, 'utf8', (err) => {
                    closeFd(fd);
                    if (err)
                        throw err;
                });
            }
            catch (err) {
                closeFd(fd);
                throw err;
            }
        });
        return msg;
    }
    // Getter Log
    get executeLog() {
        return this.Log();
    }
}
// Eror Management
function errorManagment(priority, code, tag, msg) {
    var error = new errorExcept(priority, code, tag, msg);
    if (code == 'ER_DUP_ENTRY') {
        //error.code = 500;
        error.message = 'Clave Duplicada|Duplicate Entry';
    }
    else {
        //error.code = 500;
        error.message = msg; // 'Error En El Servidor|Internal Server Error';
    }
    return error;
}
exports.default = errorManagment;
