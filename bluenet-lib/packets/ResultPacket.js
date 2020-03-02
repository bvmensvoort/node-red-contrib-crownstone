"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wrapper for all relevant data of the object
 *
 */
const DataStepper_1 = require("../util/DataStepper");
const BluenetTypes_1 = require("../protocol/BluenetTypes");
class ResultPacket {
    constructor(data) {
        this.valid = false;
        this.load(data);
    }
    load(data) {
        let minSize = 6;
        if (data.length >= minSize) {
            this.valid = true;
            let stepper = new DataStepper_1.DataStepper(data);
            this.commandType = stepper.getUInt16();
            this.resultCode = stepper.getUInt16();
            if (BluenetTypes_1.ControlType[this.commandType] === undefined || BluenetTypes_1.ResultValue[this.resultCode] === undefined) {
                this.valid = false;
                return;
            }
            this.size = stepper.getUInt16();
            let totalSize = minSize + this.size;
            if (data.length >= totalSize) {
                this.payload = stepper.getBuffer(this.size);
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
exports.ResultPacket = ResultPacket;
//# sourceMappingURL=ResultPacket.js.map