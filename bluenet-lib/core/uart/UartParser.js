"use strict";
exports.__esModule = true;
var UartTypes_1 = require("./UartTypes");
var EventBus_1 = require("../../util/EventBus");
var ServiceData_1 = require("../../packets/ServiceData");
var UartParser = /** @class */ (function () {
    function UartParser() {
    }
    UartParser.parse = function (dataPacket) {
        var opCode = dataPacket.opCode;
        var parsedData = null;
        //        console.log("UART - opCode) {", opCode, "payload) {", dataPacket.payload)
        if (opCode == UartTypes_1.UartRxType.SERVICE_DATA) {
            console.log("Got Own service data");
            var serviceData = new ServiceData_1.ServiceData(dataPacket.payload);
            serviceData.parse();
            if (serviceData.validData) {
                EventBus_1.eventBus.emit("SelfServiceData", serviceData.getJSON());
            }
        }
        else if (opCode == UartTypes_1.UartRxType.MESH_SERVICE_DATA) {
            console.log("Got Mesh service data");
            var serviceData = new ServiceData_1.ServiceData(dataPacket.payload, true);
            serviceData.parse(true);
            if (serviceData.validData) {
                EventBus_1.eventBus.emit("MeshServiceData", serviceData.getJSON());
            }
            // serviceData = ServiceData(dataPacket.payload)
            // if (serviceData.validData) {
            // BluenetEventBus.emit(DevTopics.newServiceData, serviceData.getDictionary())
            // }
        }
        else if (opCode == UartTypes_1.UartRxType.CROWNSTONE_ID) {
            console.log("Got Crownstone Id");
            // id = Conversion.int8_to_uint8(dataPacket.payload)
            // BluenetEventBus.emit(DevTopics.ownCrownstoneId, id)
        }
        else if (opCode == UartTypes_1.UartRxType.MAC_ADDRESS) {
            console.log("Got MAC address");
            // if (addr !== "") {
            //     // BluenetEventBus.emit(DevTopics.ownMacAddress, addr)
            // }
            // else {
            //     // console.log("invalid address) {", dataPacket.payload)
            // }
        }
        else if (opCode == UartTypes_1.UartRxType.POWER_LOG_CURRENT) {
            console.log("Got MAC address");
            // type is CurrentSamples
            // parsedData = CurrentSamplesPacket(dataPacket.payload)
            // BluenetEventBus.emit(DevTopics.newCurrentData, parsedData.getDict())
        }
        else if (opCode == UartTypes_1.UartRxType.POWER_LOG_VOLTAGE) {
            // type is VoltageSamplesPacket
            // parsedData = VoltageSamplesPacket(dataPacket.payload)
            // BluenetEventBus.emit(DevTopics.newVoltageData, parsedData.getDict())
        }
        else if (opCode == UartTypes_1.UartRxType.POWER_LOG_FILTERED_CURRENT) {
            // type is CurrentSamples
            // parsedData = CurrentSamplesPacket(dataPacket.payload)
            // BluenetEventBus.emit(DevTopics.newFilteredCurrentData, parsedData.getDict())
        }
        else if (opCode == UartTypes_1.UartRxType.POWER_LOG_FILTERED_VOLTAGE) {
            // type is VoltageSamplesPacket
            // parsedData = VoltageSamplesPacket(dataPacket.payload)
            // BluenetEventBus.emit(DevTopics.newFilteredVoltageData, parsedData.getDict())
        }
        else if (opCode == UartTypes_1.UartRxType.POWER_LOG_POWER) {
            // type is PowerCalculationsPacket
            // parsedData = PowerCalculationPacket(dataPacket.payload)
            // BluenetEventBus.emit(DevTopics.newCalculatedPowerData, parsedData.getDict())
        }
        else if (opCode == UartTypes_1.UartRxType.ADC_CONFIG) {
            // type is PowerCalculationsPacket
            // parsedData = AdcConfigPacket(dataPacket.payload)
            // BluenetEventBus.emit(DevTopics.newAdcConfigPacket, parsedData.getDict())
        }
        else if (opCode == UartTypes_1.UartRxType.ADC_RESTART) {
            // BluenetEventBus.emit(DevTopics.adcRestarted, null)
        }
        else if (opCode == UartTypes_1.UartRxType.ASCII_LOG) {
            var stringResult = "";
            for (var i = 0; i < dataPacket.payload.length; i++) {
                var byte = dataPacket.payload[i];
                if (byte < 128) {
                    stringResult += String.fromCharCode(byte);
                }
            }
            console.log("LOG:", new Date().valueOf(), ":" + stringResult);
        }
        else if (opCode == UartTypes_1.UartRxType.UART_MESSAGE) {
            console.log("UartMessage");
            EventBus_1.eventBus.emit("UartMessage", { string: dataPacket.payload.toString(), data: dataPacket.payload });
        }
        else {
            console.log("Unknown OpCode", opCode);
        }
        parsedData = null;
    };
    return UartParser;
}());
exports.UartParser = UartParser;
