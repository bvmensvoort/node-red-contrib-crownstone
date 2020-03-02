"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../../../util/Util");
const Timestamp_1 = require("../../../util/Timestamp");
function parseOpCode3_type1(serviceData, data) {
    if (data.length == 16) {
        // dataType = data[0]
        serviceData.errorMode = true;
        serviceData.crownstoneId = data.readUInt8(1);
        serviceData.errorsBitmask = data.readUInt32LE(2);
        serviceData.errorTimestamp = data.readUInt32LE(6);
        serviceData.flagsBitmask = data.readUInt8(10);
        // bitmask states
        let bitmaskArray = Util_1.Util.getBitMaskUInt8(serviceData.flagsBitmask);
        serviceData.dimmerReady = bitmaskArray[0];
        serviceData.dimmingAllowed = bitmaskArray[1];
        serviceData.hasError = bitmaskArray[2];
        serviceData.switchLocked = bitmaskArray[3];
        serviceData.timeIsSet = bitmaskArray[4];
        serviceData.switchCraftEnabled = bitmaskArray[5];
        serviceData.temperature = data.readUInt8(11);
        serviceData.partialTimestamp = data.readUInt16LE(12);
        serviceData.uniqueIdentifier = serviceData.partialTimestamp;
        if (serviceData.timeIsSet) {
            serviceData.timestamp = Timestamp_1.reconstructTimestamp(new Date().valueOf() * 1000, serviceData.partialTimestamp);
        }
        else {
            serviceData.timestamp = serviceData.partialTimestamp; // this is now a counter
        }
        let realPower = data.readInt16LE(14);
        serviceData.powerUsageReal = realPower / 8;
        // this packets has no validation
        serviceData.validation = 0;
    }
}
exports.parseOpCode3_type1 = parseOpCode3_type1;
//# sourceMappingURL=opCode3_type1.js.map