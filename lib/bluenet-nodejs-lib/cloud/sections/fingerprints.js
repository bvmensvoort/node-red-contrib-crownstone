"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fingerprints = {
    createFingerprint: function (cloudLocationId, data, background) {
        return this._setupRequest('POST', '/Devices/{id}/fingerprint?locationId=' + cloudLocationId, { background: background, data: data }, 'body');
    },
    getFingerprintsInLocations: function (cloudLocationIdArray, background = true) {
        return this._setupRequest('GET', '/Devices/{id}/fingerprintsForLocations?locationIds=' + JSON.stringify(cloudLocationIdArray), { background: background });
    },
    getFingerprints: function (fingerprintIdArray, background = true) {
        return this._setupRequest('GET', '/Devices/{id}/fingerprints?fingerprintIds=' + JSON.stringify(fingerprintIdArray), { background: background });
    },
    updateFingerprint: function (fingerprintId, data, background = true) {
        return this._setupRequest('PUT', '/Devices/{id}/fingerprint?fingerprintId=' + fingerprintId, { background: background, data: data }, 'body');
    },
    getMatchingFingerprintsInLocations: function (cloudLocationIdArray, background = true) {
        return this._setupRequest('GET', '/Devices/{id}/fingerprintsMatching?locationIds=' + JSON.stringify(cloudLocationIdArray), { background: background });
    },
    linkFingerprints: function (fingerprintIdArray, background = true) {
        return this._setupRequest('POST', '/Devices/{id}/fingerprintsLink?fingerprintIds=' + JSON.stringify(fingerprintIdArray), { background: background });
    },
    getFingerprintUpdateTimes: function (fingerprintIdArray, background = true) {
        return this._setupRequest('GET', '/Devices/{id}/fingerprintsUpdatedAt?fingerprintIds=' + JSON.stringify(fingerprintIdArray), { background: background });
    },
};
//# sourceMappingURL=fingerprints.js.map