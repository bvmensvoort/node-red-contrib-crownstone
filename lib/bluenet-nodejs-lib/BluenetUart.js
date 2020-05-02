"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialport_1 = __importDefault(require("serialport"));
const BlePackets_1 = require("./protocol/BlePackets");
const BluenetTypes_1 = require("./protocol/BluenetTypes");
const UartTypes_1 = require("./core/uart/UartTypes");
const UartWrapper_1 = require("./core/uart/uartPackets/UartWrapper");
const UartReadBuffer_1 = require("./core/uart/UartReadBuffer");
const UartParser_1 = require("./core/uart/UartParser");
const EventBus_1 = require("./util/EventBus");
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
class BluenetUart {
    constructor() {
        this.ports = {};
        this.port = null;
        this.readBuffer = null;
        this.triedPaths = [];
        this.readBuffer = new UartReadBuffer_1.UartReadBuffer((data) => {
            UartParser_1.UartParser.parse(data);
        });
        this.openPort();
    }
    openPort() {
        updatePorts().then((available) => {
            var _a, _b;
            this.ports = available;
            let portPaths = Object.keys(this.ports);
            for (let i = 0; i < portPaths.length; i++) {
                let path = portPaths[i];
                if (((_a = this.ports[path].port) === null || _a === void 0 ? void 0 : _a.manufacturer) === "Silicon Labs" || ((_b = this.ports[path].port) === null || _b === void 0 ? void 0 : _b.manufacturer) === "SEGGER") {
                    if (this.triedPaths.indexOf(path) === -1) {
                        this.tryPath(path);
                        break;
                    }
                }
            }
        });
    }
    tryPath(path) {
        this.triedPaths.push(path);
        this.port = new serialport_1.default(path, { baudRate: 230400 });
        const ByteLength = serialport_1.default.parsers.ByteLength;
        const parser = new ByteLength({ length: 1 });
        this.port.pipe(parser);
        parser.on('data', (response) => { this.readBuffer.addByteArray(response); });
        this.port.on("open", () => {
            let HANDSHAKE = "HelloCrownstone";
            let success = false;
            let unsubscribe = EventBus_1.eventBus.on("UartMessage", (data) => {
                var _a;
                console.log("Got the message", data.string);
                if (((_a = data) === null || _a === void 0 ? void 0 : _a.string) === HANDSHAKE) {
                    success = true;
                    clearTimeout(closeTimeout);
                    unsubscribe();
                }
            });
            let closeTimeout = setTimeout(() => {
                if (!success) {
                    unsubscribe();
                    this.port.close(() => {
                        // try another.
                        this.openPort();
                    });
                }
            }, 200);
            this.uartEcho(HANDSHAKE);
        });
    }
    uartEcho(string) {
        let controlPacket = new BlePackets_1.ControlPacket(BluenetTypes_1.ControlType.UART_MESSAGE).loadString(string).getPacket();
        // finally wrap it in an Uart packet
        let uartPacket = new UartWrapper_1.UartWrapper(UartTypes_1.UartTxType.CONTROL, controlPacket).getPacket();
        this.port.write(uartPacket);
    }
}
exports.BluenetUart = BluenetUart;
//# sourceMappingURL=BluenetUart.js.map