"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Characteristics_1 = require("../../../protocol/Characteristics");
const Services_1 = require("../../../protocol/Services");
const ControlPackets_1 = require("../../../protocol/ControlPackets");
const BluenetError_1 = require("../../../BluenetError");
const ResultPacket_1 = require("../../../packets/ResultPacket");
const BluenetTypes_1 = require("../../../protocol/BluenetTypes");
const Log_1 = require("../../../util/logging/Log");
class SetupHandler {
    constructor(ble) {
        this.ble = ble;
    }
    setup(sphereUid, crownstoneId, meshAccessAddress, meshDeviceKey, ibeaconUUID, ibeaconMajor, ibeaconMinor) {
        return new Promise((resolve, reject) => {
            if (!this.ble.settings.adminKey || !this.ble.settings.memberKey || !this.ble.settings.basicKey || !this.ble.settings.serviceDataKey || !this.ble.settings.localizationKey || !this.ble.settings.meshAppKey || !this.ble.settings.meshNetworkKey) {
                return reject(new BluenetError_1.BluenetError(BluenetError_1.BluenetErrorType.NO_ENCRYPTION_KEYS, "No encryption keys available. These are required to setup a Crownstone. Use either linkCloud or setSettings to load keys into Bluenet."));
            }
            if (this.ble.connectedPeripheral.characteristics[Services_1.CSServices.SetupService][Characteristics_1.SetupCharacteristics.Control]) {
                resolve(this._performFastSetupV2(sphereUid, crownstoneId, meshDeviceKey, ibeaconUUID, ibeaconMajor, ibeaconMinor));
            }
            else {
                reject(new BluenetError_1.BluenetError(BluenetError_1.BluenetErrorType.INCOMPATIBLE_FIRMWARE, "This Crownstone has an old firmware and is not compatible with this lib."));
            }
        });
    }
    _performFastSetupV2(sphereUid, crownstoneId, meshDeviceKey, ibeaconUUID, ibeaconMajor, ibeaconMinor) {
        let processHandler = (returnData) => {
            let packet = new ResultPacket_1.ResultPacket(returnData);
            if (packet.valid) {
                let payload = packet.payload.readUInt16LE(0);
                if (payload == BluenetTypes_1.ResultValue.WAIT_FOR_SUCCESS) {
                    // thats ok
                    return BluenetTypes_1.ProcessType.CONTINUE;
                }
                else if (payload == BluenetTypes_1.ResultValue.SUCCESS) {
                    return BluenetTypes_1.ProcessType.FINISHED;
                }
                else {
                    return BluenetTypes_1.ProcessType.ABORT_ERROR;
                }
            }
            else {
                // stop, something went wrong
                return BluenetTypes_1.ProcessType.ABORT_ERROR;
            }
        };
        let writeCommand = () => {
            this._commandSetupV2(sphereUid, crownstoneId, this.ble.settings.adminKey, this.ble.settings.memberKey, this.ble.settings.basicKey, this.ble.settings.serviceDataKey, this.ble.settings.localizationKey, this.ble.settings.meshNetworkKey, this.ble.settings.meshAppKey, meshDeviceKey, ibeaconUUID, ibeaconMajor, ibeaconMinor);
        };
        return this._handleSetupPhaseEncryption()
            .then(() => {
            return this.ble.setupNotificationStream(Services_1.CSServices.SetupService, Characteristics_1.SetupCharacteristics.Result, writeCommand, processHandler, 3);
        })
            .then(() => {
            Log_1.LOG.info("BLUENET_LIB: SetupCommand Finished, disconnecting");
            return this.ble.waitForPeripheralToDisconnect(10);
        })
            .then(() => {
            Log_1.LOG.info("BLUENET_LIB: Setup Finished");
            this.ble.settings.exitSetup();
        })
            .catch((err) => {
            this.ble.settings.exitSetup();
            this.ble.settings.restoreEncryption();
            this.ble.errorDisconnect();
            throw err;
        });
    }
    _handleSetupPhaseEncryption() {
        return new Promise((resolve, reject) => {
            this.ble.settings.disableEncryptionTemporarily();
            this._getSessionKey()
                .then((key) => {
                this.ble.settings.loadSetupKey(key);
                return this._getSessionNonce();
            })
                .then((nonce) => {
                this.ble.settings.setSessionNonce(nonce);
                this.ble.settings.restoreEncryption();
                resolve();
            })
                .catch((err) => {
                this.ble.settings.restoreEncryption();
                reject(err);
            });
        });
    }
    _commandSetupV2(sphereUid, crownstoneId, adminKey, memberKey, basicKey, serviceDataKey, localizationKey, meshNetworkKey, meshAppKey, meshDeviceKey, ibeaconUUID, ibeaconMajor, ibeaconMinor) {
        let packet = ControlPackets_1.ControlPacketsGenerator.getSetupPacketV2(sphereUid, crownstoneId, adminKey, memberKey, basicKey, serviceDataKey, localizationKey, meshNetworkKey, meshAppKey, meshDeviceKey, ibeaconUUID, ibeaconMajor, ibeaconMinor);
        return this.ble.writeToCharacteristic(Services_1.CSServices.SetupService, Characteristics_1.SetupCharacteristics.Control, packet);
    }
    _commandSetup(crownstoneId, adminKey, memberKey, guestKey, meshAccessAddress, ibeaconUUID, ibeaconMajor, ibeaconMinor) {
        let packet = ControlPackets_1.ControlPacketsGenerator.getSetupPacket(0, crownstoneId, adminKey, memberKey, guestKey, meshAccessAddress, ibeaconUUID, ibeaconMajor, ibeaconMinor);
        return this.ble.writeToCharacteristic(Services_1.CSServices.SetupService, Characteristics_1.SetupCharacteristics.Control, packet);
    }
    _getSessionKey() {
        return this.ble.readCharacteristicWithoutEncryption(Services_1.CSServices.SetupService, Characteristics_1.SetupCharacteristics.SessionKey);
    }
    _getSessionNonce() {
        return this.ble.readCharacteristicWithoutEncryption(Services_1.CSServices.SetupService, Characteristics_1.SetupCharacteristics.SessionNonce);
    }
}
exports.SetupHandler = SetupHandler;
//# sourceMappingURL=SetupHandler.js.map