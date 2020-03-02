"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluenetError_1 = require("../BluenetError");
class DataStepper {
    constructor(buffer) {
        this.buffer = null;
        this.position = 0;
        this.length = 0;
        this.buffer = buffer;
        this.length = buffer.length;
    }
    getUInt8() {
        let source = this._request(1);
        return source.readUInt8(0);
    }
    getUInt16() {
        let source = this._request(2);
        return source.readUInt16LE(0);
    }
    getBuffer(size) {
        return this._request(size);
    }
    _request(size) {
        if (this.position + size <= this.length) {
            let start = this.position;
            this.position += size;
            return new Buffer(this.buffer.slice(start, this.position));
        }
        else {
            throw new BluenetError_1.BluenetError(BluenetError_1.BluenetErrorType.INVALID_DATA_LENGTH, "Tried to get more bytes from buffer than were available.");
        }
    }
}
exports.DataStepper = DataStepper;
//# sourceMappingURL=DataStepper.js.map