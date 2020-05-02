"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLevel = {
    admin: 0,
    member: 1,
    basic: 2,
    setup: 100,
    unknown: 255,
};
class BluenetSettings {
    constructor() {
        this.encryptionEnabled = true;
        this.adminKey = null;
        this.memberKey = null;
        this.basicKey = null;
        this.serviceDataKey = null;
        this.localizationKey = null;
        this.meshNetworkKey = null;
        this.meshAppKey = null;
        this.setupKey = null;
        this.referenceId = null;
        this.sessionNonce = null;
        this.initializedKeys = false;
        this.temporaryDisable = false;
        this.userLevel = exports.UserLevel.unknown;
    }
    loadKeys(encryptionEnabled, adminKey = null, memberKey = null, basicKey = null, serviceDataKey = null, localizationKey = null, meshNetworkKey = null, meshAppKey = null, referenceId) {
        this.encryptionEnabled = encryptionEnabled;
        this.adminKey = this._prepKey(adminKey);
        this.memberKey = this._prepKey(memberKey);
        this.basicKey = this._prepKey(basicKey);
        this.serviceDataKey = this._prepKey(serviceDataKey);
        this.localizationKey = this._prepKey(localizationKey);
        this.meshNetworkKey = this._prepKey(meshNetworkKey);
        this.meshAppKey = this._prepKey(meshAppKey);
        this.referenceId = referenceId;
        this.initializedKeys = true;
        this.determineUserLevel();
    }
    _prepKey(key) {
        if (!key) {
            return Buffer.alloc(16);
        }
        if (key.length === 16) {
            return Buffer.from(key, 'ascii');
        }
        else if (key.length === 32) {
            return Buffer.from(key, 'hex');
        }
        else {
            throw "Invalid Key: " + key;
        }
    }
    determineUserLevel() {
        if (this.adminKey.length == 16) {
            this.userLevel = exports.UserLevel.admin;
        }
        else if (this.memberKey.length == 16) {
            this.userLevel = exports.UserLevel.member;
        }
        else if (this.basicKey.length == 16) {
            this.userLevel = exports.UserLevel.basic;
        }
        else {
            this.userLevel = exports.UserLevel.unknown;
            this.initializedKeys = false;
        }
    }
    invalidateSessionNonce() {
        this.sessionNonce = null;
    }
    setSessionNonce(sessionNonce) {
        this.sessionNonce = sessionNonce;
    }
    loadSetupKey(setupKey) {
        this.setupKey = setupKey;
        this.userLevel = exports.UserLevel.setup;
    }
    exitSetup() {
        this.setupKey = null;
        this.determineUserLevel();
    }
    disableEncryptionTemporarily() {
        this.temporaryDisable = true;
    }
    restoreEncryption() {
        this.temporaryDisable = false;
    }
    isTemporarilyDisabled() {
        return this.temporaryDisable;
    }
    isEncryptionEnabled() {
        if (this.temporaryDisable) {
            return false;
        }
        return this.encryptionEnabled;
    }
}
exports.BluenetSettings = BluenetSettings;
//# sourceMappingURL=BluenetSettings.js.map