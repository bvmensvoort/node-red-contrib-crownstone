"use strict";
exports.__esModule = true;
/**
 * Wrapper for all relevant data of the object
 *
 */
var DataStepper_1 = require("../../../util/DataStepper");
var UartPacket = /** @class */ (function () {
    function UartPacket(data) {
        this.valid = false;
        this.load(data);
    }
    UartPacket.prototype.load = function (data) {
        var minSize = 6; // opcode, size and crc
        if (data.length >= minSize) {
            this.valid = true;
            var stepper = new DataStepper_1.DataStepper(data);
            try {
                this.opCode = stepper.getUInt16();
                this.size = stepper.getUInt16();
                var totalSize = minSize + this.size;
                if (data.length >= totalSize) {
                    this.payload = stepper.getBuffer(this.size);
                    this.crc = stepper.getUInt16();
                }
                else {
                    this.valid = false;
                }
            }
            catch (err) {
                this.valid = false;
            }
        }
        else {
            this.valid = false;
        }
    };
    return UartPacket;
}());
exports.UartPacket = UartPacket;
