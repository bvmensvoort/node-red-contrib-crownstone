module.exports = function (RED) {
    const CrownstoneAPI = new (require("./CrownstoneAPI.js"))();
    const BluenetLib = require("../bluenet-lib/index");
    const bluenet = new BluenetLib.Bluenet();
    
    let isScanning = false;
    let isLinked = false;

    // Enable webservices
    RED.httpAdmin.get('/crownstone/accountsave', accountSave);
    RED.httpAdmin.get('/crownstone/getSpheres', getSpheres);
    RED.nodes.registerType("crownstone", CrownstoneNode, {
        credentials: {
            email: {type:"text"},
            sha1Password: {type:"password"},
            token: ""
        }
    });

    function CrownstoneNode(config) {
        let node = this;
        let nodeConfig = config;
        RED.nodes.createNode(node, config);

        // Control scanning
        this.on('input', onInput);
        // Called when the node is shutdown - eg on redeploy.
        this.on("close", onClose);

        function onInput(msg, send, done) {
            // For backward compatibility
            send = send || function() { node.send.apply(node,arguments); }
            done = done || function(err, msg) { node.error(err, msg); }

            // Go
            if (!msg.hasOwnProperty("payload") || typeof msg.payload !== "object" || !msg.payload.hasOwnProperty("scan")) {
                node.warn("Incorrect input, ignoring. See the documentation in the info tab. ");
                return;
            }
            
            if (msg.payload.scan === true && !isScanning) {
                startScan(msg, send, done);
            } else if (msg.payload.scan === false && isScanning) {
                stopScan();
            }
        }
    
        function onClose(done) {
            // Called when the node is shutdown - eg on redeploy.
            // Allows ports to be closed, connections dropped etc.
            // eg: this.client.disconnect();
            bluenet.stopScan();
            // remove listeners since they get added again on deploy
            bluenet.cleanUp();
            done();
        }
    
        function startScan(msg, send, done) {
            console.log("Scanning for crownstones");
            var token = node.credentials && node.credentials.token;
            var sphereId = nodeConfig.sphereid;

            // Validation of input parameters
            if (!token || !sphereId) {
                node.error('Missing credentials. First establish a connection in the node config.');
                return;
            }

            // Getting encryption keys is only needed once
            if (isLinked) {
                scanning();
            } else {
                // Get encryption keys of the Crownstones from the cloud
                bluenet.linkCloud({token, sphereId})
                    .then(function() {isLinked = true;})
                    .then(scanning)
                    .catch((err) => {
                        node.error("Failed linking to cloud - " + JSON.stringify(err));
                        stopScan();
                    })
                ;
            }
            return;

            function scanning() {
                console.log(msg, send, done);

                new Promise((resolve, reject) => {
                    let devices = [];
                    bluenet.on(BluenetLib.Topics.advertisement, (data) => {
                        // Only return one message per device
                        if (devices.includes(data.handle)) return;
                        devices.push(data.handle);

                        // Send the message
                        msg.payload = data;
                        send(msg)
                    });
                    bluenet.on(BluenetLib.Topics.verifiedAdvertisement, (data) => { 
                        console.log("verified:",data);

                        msg.payload = data;
                        msg.verified = true;
                        send(msg)
                    })
                    
                    return new Promise((resolve, reject) => {
                            isScanning = true;
                            node.status({fill:"green",shape:"dot",text:"started"});
                            node.log("Scanning for BLEs started");

                            bluenet.startScanning()
                                .catch(reject)
                            ;
                            
                            setTimeout(() => {
                                stopScan();
                            }, 10000);
                        })
                        .catch((err)=>{
                            if (done) done("Error scanning Crownstones - "+ JSON.stringify(done));
                        })
                    ;
                })
                .then((devices) => {
                    stopScan();

                    return;
                    // Prevent duplicates
                    let devicesMap = devices.reduce((result, item, i) => result.set(item.handle, item), new Map());
                    devices = Array.from(devicesMap.values());

                    // Output message
                    
                })
                .catch((err) => {
                    done("Error scanning Crownstones - "+ JSON.stringify(err), msg);
                    stopScan();
                })
            }
        }
    
        function stopScan() {
            bluenet.stopScanning();
            if (isScanning) node.log('BLE scanning stopped.');
            isScanning = false;
            node.status({fill:"red",shape:"ring",text:"stopped"});
        }
    }


    function accountSave(req, res, next) {
        console.log("/account/accountsave");

        let email = req.query.email;
        let sha1Password = req.query.sha1Password;
        let nodeId = req.query.nodeId;

        if (!email || !sha1Password || !nodeId) {
            res.status(422).send(RED._("crownstone.credentials-missing"));
            return;
        }

        // Try to log in using email + sha1Password and get access token
        CrownstoneAPI.getAccessTokenAndUserId({email, password: sha1Password})
            .then((data) => {
                RED.nodes.addCredentials(nodeId, {
                    userid: data.userid,
                    sha1Password: sha1Password,
                    token: data.access_token
                });
                res.end();
            })
            .catch((err) => {
                res.status(403).send(JSON.stringify(err.data || err));
            })
        ;
    }

    function getSpheres(req, res, next) {
        console.log("/crownstone/getSpheres");
        
        let accountNodeId = req.query.nodeId;
        let credentials = RED.nodes.getCredentials(accountNodeId);
        
        if (!credentials || !credentials.userid || !credentials.token) {
            res.status(422).send(RED._("crownstone.credentials-missing"));
            return;
        }

        CrownstoneAPI.getSpheres(credentials.userid, credentials.token, credentials)
            .then((spheres) => {
                // Store somewhere
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(spheres));
            })
            .catch((err) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(403).send(JSON.stringify(err));
            })
        ;

        return;
    }
}