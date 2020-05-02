"use strict";
exports.__esModule = true;
var UartUtil_1 = require("../../../util/UartUtil");
var ESCAPE_TOKEN = 0x5c;
var BIT_FLIP_MASK = 0x40;
var START_TOKEN = 0x7e;
var UartWrapper = /** @class */ (function () {
    function UartWrapper(opCode, payload) {
        this.opCode = opCode;
        this.payload = payload;
    }
    UartWrapper.prototype.escapeCharacters = function (payload) {
        var escapedPayload = [];
        for (var i = 0; i < payload.length; i++) {
            var byte = payload[i];
            if (byte === ESCAPE_TOKEN || byte === START_TOKEN) {
                escapedPayload.push(ESCAPE_TOKEN);
                var escapedByte = byte ^ BIT_FLIP_MASK;
                escapedPayload.push(escapedByte);
            }
            else {
                escapedPayload.push(byte);
            }
        }
        return Buffer.from(escapedPayload);
    };
    UartWrapper.prototype.getPacket = function () {
        // get the length of the payload before escaping
        var baseLength = this.payload.length;
        // construct the basePacket, which is used for CRC calculation
        var basePacket = Buffer.alloc(4);
        basePacket.writeUInt16LE(this.opCode, 0);
        basePacket.writeUInt16LE(baseLength, 2);
        basePacket = Buffer.concat([basePacket, this.payload]);
        // calculate the CRC of the packet so
        var baseCrc = UartUtil_1.UartUtil.crc16_ccitt(basePacket);
        var crcBuffer = Buffer.alloc(2);
        crcBuffer.writeUInt16LE(baseCrc, 0);
        // append the CRC to the base packet to escape the entire thing
        basePacket = Buffer.concat([basePacket, crcBuffer]);
        // escape everything except the START_TOKEN
        var escapedPayload = this.escapeCharacters(basePacket);
        var uartPacket = Buffer.concat([Buffer.from([START_TOKEN]), escapedPayload]);
        return uartPacket;
    };
    return UartWrapper;
}());
exports.UartWrapper = UartWrapper;
