"use strict";
exports.__esModule = true;
var serialport_1 = require("serialport");
function updatePorts() {
    return new Promise(function (resolve, reject) {
        var availablePorts = {};
        serialport_1["default"].list().then(function (ports) {
            ports.forEach(function (port) {
                availablePorts[port.path] = { port: port, connected: false };
            });
            resolve(availablePorts);
        });
    });
}
updatePorts().then(function (R) { console.log(R); });
var UartBridge = /** @class */ (function () {
    function UartBridge(path, baudrate) {
        this.baudrate = 230400;
        this.path = '';
        this.serialController = null;
        this.parser = null;
        this.eventId = 0;
        this.running = true;
        this.baudrate = baudrate;
        this.path = path;
        this.serialController = null;
        this.parser = null;
        this.eventId = 0;
        this.running = true;
        this.startSerial();
        // threading.Thread.__init__()
    }
    UartBridge.prototype.run = function () {
        // this.eventId = BluenetEventBus.subscribe(SystemTopics.uartWriteData, this.writeToUart)
        //
        // BluenetEventBus.subscribe(SystemTopics.cleanUp, this.stop())
        // this.parser = UartParser()
        // this.startReading()
    };
    UartBridge.prototype.stop = function () {
        // print("Stopping UartBridge")
        // this.running = False
        // BluenetEventBus.unsubscribe(eventId)
    };
    UartBridge.prototype.startSerial = function () {
        // print("Initializing serial on port ", this.port, ' with baudrate ', this.baudrate)
        // this.serialController = serial.Serial()
        // this.serialController.port = this.port
        // this.serialController.baudrate = int(baudrate)
        // this.serialController.timeout = null
        // this.serialController.open()
    };
    UartBridge.prototype.startReading = function () {
        // readBuffer = UartReadBuffer()
        // print("Read starting on serial port.")
        // while this.running:
        // bytes = this.serialController.read()
        // if bytes:
        // // clear out the entire read buffer
        // if this.serialController.in_waiting > 0:
        // additionalBytes = this.serialController.read(serialController.in_waiting)
        // bytes = bytes + additionalBytes
        // readBuffer.addByteArray(bytes)
        //
        // print("Cleaning up")
        // this.serialController.close()
    };
    UartBridge.prototype.writeToUart = function (data) {
        // this.serialController.write(data)
    };
    return UartBridge;
}());
exports.UartBridge = UartBridge;
