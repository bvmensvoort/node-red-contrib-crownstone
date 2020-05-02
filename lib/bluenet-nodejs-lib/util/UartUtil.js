"use strict";
exports.__esModule = true;
var UartUtil = /** @class */ (function () {
    function UartUtil() {
    }
    UartUtil.uartEscape = function (val) {
        if (Array.isArray(val)) {
            // # Escape special chars:
            var escapedMsg = [];
            for (var i = 0; i < val.length; i++) {
                var c = val[i];
                if (c == UartUtil.UART_ESCAPE_CHAR || c == UartUtil.UART_START_CHAR) {
                    escapedMsg.push(UartUtil.UART_ESCAPE_CHAR);
                    c = UartUtil.uartEscape(c);
                }
                escapedMsg.push(c);
            }
            return escapedMsg;
        }
        else {
            return val ^ UartUtil.UART_ESCAPE_FLIP_MASK;
        }
    };
    UartUtil.uartUnescape = function (val) {
        return val ^ UartUtil.UART_ESCAPE_FLIP_MASK;
    };
    // Copied implementation of nordic
    UartUtil.crc16_ccitt = function (arr8) {
        var crc = 0xFFFF;
        for (var i = 0; i < arr8.length; i++) {
            crc = (crc >> 8 & 0xFF) | (crc << 8 & 0xFFFF);
            crc ^= arr8[i];
            crc ^= (crc & 0xFF) >> 4;
            crc ^= (crc << 8 & 0xFFFF) << 4 & 0xFFFF;
            crc ^= ((crc & 0xFF) << 4 & 0xFFFF) << 1 & 0xFFFF;
        }
        return crc;
    };
    UartUtil.UART_START_CHAR = 0x7E;
    UartUtil.UART_ESCAPE_CHAR = 0x5C;
    UartUtil.UART_ESCAPE_FLIP_MASK = 0x40;
    return UartUtil;
}());
exports.UartUtil = UartUtil;
