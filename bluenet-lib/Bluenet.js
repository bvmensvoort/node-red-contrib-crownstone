"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BleHandler_1 = require("./core/ble/BleHandler");
const BluenetSettings_1 = require("./BluenetSettings");
const EventBus_1 = require("./util/EventBus");
const ControlHandler_1 = require("./core/ble/modules/ControlHandler");
const CloudHandler_1 = require("./cloud/CloudHandler");
const Topics_1 = require("./topics/Topics");
const SetupHandler_1 = require("./core/ble/modules/SetupHandler");
class Bluenet {
    constructor() {
        this.settings = new BluenetSettings_1.BluenetSettings();
        this.ble = new BleHandler_1.BleHandler(this.settings);
        this.control = new ControlHandler_1.ControlHandler(this.ble);
        this.setup = new SetupHandler_1.SetupHandler(this.ble);
        this.cloud = new CloudHandler_1.CloudHandler();
    }
    /**
     *
     * @param keys
     * @param {string} referenceId
     * @param {boolean} encryptionEnabled
     */
    setSettings(keys, referenceId = "BluenetNodeJSLib", encryptionEnabled = true) {
        this.settings.loadKeys(encryptionEnabled, keys.adminKey, keys.memberKey, keys.basicKey, keys.serviceDataKey, keys.localizationKey, keys.meshNetworkKey, keys.meshAppKey, referenceId);
    }
    /**
     *
     * @returns {Promise<any>}
     */
    isReady() {
        return this.ble.isReady();
    }
    linkCloud(userData) {
        if (userData.adminKey !== undefined && userData.serviceDataKey !== undefined) {
            return new Promise((resolve, reject) => {
                console.log("Keys found in userData, no need to link Cloud.");
                this.settings.loadKeys(true, userData.adminKey, userData.memberKey, userData.basicKey, userData.serviceDataKey, userData.localizationKey, userData.meshNetworkKey, userData.meshAppKey, "UserData");
                resolve();
            });
        }
        else {
            return this.cloud.login(userData)
                .then(() => {
                return this.cloud.getKeys(userData.sphereId);
            })
                .then((keys) => {
                this.settings.loadKeys(true, keys.ADMIN_KEY, keys.MEMBER_KEY, keys.BASIC_KEY, keys.SERVICE_DATA_KEY, keys.LOCALIZATION_KEY, keys.MESH_NETWORK_KEY, keys.MESH_APPLICATION_KEY, "CloudData");
            });
        }
    }
    connect(connectData, scanDuration = 5) {
        return this.ble.connect(connectData, scanDuration)
            .then(() => {
            console.log("Getting Session Nonce...");
            return this.control.getAndSetSessionNonce();
        })
            .then(() => {
            console.log("Session Nonce Processed.");
        });
    }
    wait(seconds) {
        return new Promise((resolve, reject) => {
            setTimeout(() => { resolve(); }, seconds * 1000);
        });
    }
    setupCrownstone(handle, sphereUid, crownstoneId, meshAccessAddress, meshDeviceKey, ibeaconUUID, ibeaconMajor, ibeaconMinor) {
        return this.connect(handle)
            .then(() => {
            return this.setup.setup(sphereUid, crownstoneId, meshAccessAddress, meshDeviceKey, ibeaconUUID, ibeaconMajor, ibeaconMinor);
        });
    }
    disconnect() {
        return this.ble.disconnect();
    }
    cleanUp() {
        this.ble.cleanUp();
    }
    quit() {
        this.ble.cleanUp();
        // this is a hard quit. Your program will end here.
        process.exit(1);
    }
    startScanning() {
        return this.ble.startScanning();
    }
    stopScanning() {
        this.ble.stopScanning();
    }
    on(topic, callback) {
        return EventBus_1.eventBus.on(topic, callback);
    }
    getNearestCrownstone(rssiAtLeast = -100, scanDuration = 5, returnFirstAcceptable = false, addressesToExclude = []) {
        return this._getNearest(false, false, rssiAtLeast, scanDuration, returnFirstAcceptable, addressesToExclude);
    }
    getNearestValidatedCrownstone(rssiAtLeast = -100, scanDuration = 5, returnFirstAcceptable = false, addressesToExclude = []) {
        return this._getNearest(false, true, rssiAtLeast, scanDuration, returnFirstAcceptable, addressesToExclude);
    }
    getNearestSetupStone(rssiAtLeast = -100, scanDuration = 5, returnFirstAcceptable = false, addressesToExclude = []) {
        return this._getNearest(true, true, rssiAtLeast, scanDuration, returnFirstAcceptable, addressesToExclude);
    }
    _getNearest(setupMode, verifiedOnly, rssiAtLeast = -100, scanDuration = 5, returnFirstAcceptable = false, addressesToExclude = []) {
        return new Promise((resolve, reject) => {
            let fallbackTimeout = null;
            let unsubscribe = null;
            let results = [];
            let finalize = () => {
                clearTimeout(fallbackTimeout);
                unsubscribe();
                this.stopScanning();
                if (results.length > 0) {
                    results.sort((a, b) => { return a.rssi - b.rssi; });
                    resolve(results[0]);
                }
                else {
                    reject("Timeout: No stones found");
                }
            };
            fallbackTimeout = setTimeout(() => { finalize(); }, scanDuration * 1000);
            let checkResults = (data) => {
                if (addressesToExclude.indexOf(data.handle) !== -1 && addressesToExclude.indexOf(data.address) !== -1) {
                    return;
                }
                if (data.rssi >= rssiAtLeast) {
                    results.push(data);
                    if (returnFirstAcceptable) {
                        finalize();
                    }
                }
            };
            if (verifiedOnly || setupMode) {
                unsubscribe = this.on(Topics_1.Topics.verifiedAdvertisement, (data) => {
                    checkResults(data);
                });
            }
            else {
                unsubscribe = this.on(Topics_1.Topics.advertisement, (data) => {
                    checkResults(data);
                });
            }
            this.startScanning();
        });
    }
}
exports.default = Bluenet;
//# sourceMappingURL=Bluenet.js.map