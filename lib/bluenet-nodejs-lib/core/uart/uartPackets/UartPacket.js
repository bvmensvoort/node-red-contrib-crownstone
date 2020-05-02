"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wrapper for all relevant data of the object
 *
 */
const DataStepper_1 = require("../../../util/DataStepper");
class UartWrapperPacket {
    constructor(data) {
        this.valid = false;
        this.load(data);
    }
    load(data) {
        let minSize = 7; // start, opcode, size and crc
        if (data.length >= minSize) {
            this.valid = true;
            let stepper = new DataStepper_1.DataStepper(data);
            this.start = stepper.getUInt8();
            this.opCode = stepper.getUInt16();
            this.size = stepper.getUInt16();
            let totalSize = minSize + this.size;
            if (data.length >= totalSize) {
                this.payload = stepper.getBuffer(this.size);
                this.crc = stepper.getUInt16();
            }
            else {
                this.valid = false;
            }
        }
        else {
            this.valid = false;
        }
    }
}
exports.UartWrapperPacket = UartWrapperPacket;
//# sourceMappingURL=UartPacket.js.map