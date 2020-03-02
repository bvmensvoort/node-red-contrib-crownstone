module.exports = function(RED) {
    function RemoteServerNode(n) {
        RED.nodes.createNode(this,n);
        this.host = n.host;
        this.port = n.port;
    }
    RED.nodes.registerType("crownstones",RemoteServerNode);

    RED.httpAdmin.get('/crownstone/crownstones', function(req, res, next)
	{
        res.end("[{host:'AAA', port:1234}, {host:'BBB', port:1235}]"); 

        // let BluenetLib = require("bluenet-lib/index");
            // let bluenet = new BluenetLib.Bluenet();

            // bluenet.setSettings({
            //     adminKey: 'adminKeyForCrown',
            //     memberKey: 'memberKeyForHome',
            //     basicKey: 'basicKeyForOther',
            //     serviceDataKey: 'basicKeyForOther',
            //     localizationKey: 'LocalizationKeyX',
            //     meshNetworkKey: 'AGreatMeshNetKey',
            //     meshAppKey: 'MyFavoMeshAppKey',
            // });
            // bluenet.startScanning().catch((err) => { this.trace("Error while running example:", err); })

            // // print scans.
            // console.log("Starting Scan for 10 seconds");

            // bluenet.on(BluenetLib.Topics.advertisement, (data) => { this.trace("Got unverified advertisement"); })
            // bluenet.on(BluenetLib.Topics.verifiedAdvertisement, (data) => { this.trace("verified:", data); })

            // // quit
            // setTimeout(() => { bluenet.stopScanning(); bluenet.quit(); }, 10000); 
	});
}