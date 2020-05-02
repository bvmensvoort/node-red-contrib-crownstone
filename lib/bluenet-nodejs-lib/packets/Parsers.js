"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const opCode3_type0_1 = require("./AdvertisementTypes/OpCode3/opCode3_type0");
const opCode3_type1_1 = require("./AdvertisementTypes/OpCode3/opCode3_type1");
const opCode3_type2_1 = require("./AdvertisementTypes/OpCode3/opCode3_type2");
const opCode3_type3_1 = require("./AdvertisementTypes/OpCode3/opCode3_type3");
const opCode4_type0_1 = require("./AdvertisementTypes/OpCode4/opCode4_type0");
function parseOpCode3(serviceData, data) {
    if (data.length !== 16) {
        return;
    }
    serviceData.dataType = data.readUInt8(0);
    switch (serviceData.dataType) {
        case 0:
            opCode3_type0_1.parseOpCode3_type0(serviceData, data);
            break;
        case 1:
            opCode3_type1_1.parseOpCode3_type1(serviceData, data);
            break;
        case 2:
            opCode3_type2_1.parseOpCode3_type2(serviceData, data);
            break;
        case 3:
            opCode3_type3_1.parseOpCode3_type3(serviceData, data);
            break;
        default:
            opCode3_type0_1.parseOpCode3_type0(serviceData, data);
    }
}
exports.parseOpCode3 = parseOpCode3;
function parseOpCode4(serviceData, data) {
    if (data.length !== 16) {
        return;
    }
    serviceData.setupMode = true;
    serviceData.dataType = data.readUInt8(0);
    switch (serviceData.dataType) {
        case 0:
            opCode4_type0_1.parseOpCode4_type0(serviceData, data);
            break;
        default:
            opCode4_type0_1.parseOpCode4_type0(serviceData, data);
    }
}
exports.parseOpCode4 = parseOpCode4;
function parseOpCode5(serviceData, data) {
    if (data.length !== 16) {
        return;
    }
    serviceData.dataType = data.readUInt8(0);
    switch (serviceData.dataType) {
        case 0:
            opCode3_type0_1.parseOpCode3_type0(serviceData, data);
            break;
        case 1:
            opCode3_type1_1.parseOpCode3_type1(serviceData, data);
            break;
        case 2:
            opCode3_type2_1.parseOpCode3_type2(serviceData, data);
            break;
        case 3:
            opCode3_type3_1.parseOpCode3_type3(serviceData, data);
            break;
        default:
            opCode3_type0_1.parseOpCode3_type0(serviceData, data);
    }
}
exports.parseOpCode5 = parseOpCode5;
function parseOpCode6(serviceData, data) {
    if (data.length !== 16) {
        return;
    }
    serviceData.dataType = data.readUInt8(0);
    switch (serviceData.dataType) {
        case 0:
            opCode4_type0_1.parseOpCode4_type0(serviceData, data);
            break;
        default:
            opCode4_type0_1.parseOpCode4_type0(serviceData, data);
    }
}
exports.parseOpCode6 = parseOpCode6;
//# sourceMappingURL=Parsers.js.map