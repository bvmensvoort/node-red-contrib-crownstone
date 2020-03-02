"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialport_1 = __importDefault(require("serialport"));
function updatePorts() {
    return new Promise((resolve, reject) => {
        let availablePorts = {};
        serialport_1.default.list().then((ports) => {
            ports.forEach((port) => {
                availablePorts[port.path] = { port: port, connected: false };
            });
            resolve(availablePorts);
        });
    });
}
updatePorts().then((R) => { console.log(R); });
//# sourceMappingURL=UartManager.js.map