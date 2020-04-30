const https = require("https");

class CrownstoneAPI {
    constructor() {}

    getSpheres(userid, access_token, extend_token_credentials) {
        const api = this;
        return new Promise((resolve, reject) => {
            let areParametersValid = !!userid && !!access_token;

            // Validate parameters
            if (!areParametersValid) {
                reject("Bad credentials.");
            }

            // Request spheres
            return api.request(`/api/users/${userid}/spheres?access_token=${access_token}`)
                .then((result) => {
                    resolve(result.map(item => ({name: item.name, id: item.id })));
                })
                .catch((err) => {
                    reject(err);
                    // // TODO: detect if token is expired
                    // const isExpired = true;
                    // // TODO: if access_token is expired. Try to get a new one
                    // if (!isExpired) {
                    //     reject(err);
                    // } else {
                    //     return getAccessTokenAndUserId(extend_token_credentials)
                    //         .then(() => {
                    //             return getSpheres(credentials.userid, credentials.access_token)
                    //         })
                    //         .catch((err) ={
                    //             reject(err);
                    //         })
                    //     ;
                    // }
                })
            ;
        });
    }

    getAccessTokenAndUserId(credentials) {
        const api = this;
        return new Promise((resolve, reject) => {
            let areCredentialsValid = !!credentials && (!!credentials.email && !!credentials.password);
            
            // Validate parameters
            if (!areCredentialsValid) {
                reject("Bad credentials.");
            }

            // Request accesstoken
            return api.request('/api/users/login', credentials, "POST")
                .then((result) => {
                    if (result.error) {
                        reject(result.error);
                        return;
                    }
                    
                    resolve({
                        "access_token": result.id,
                        "userid": result.userId
                    });
                })
                .catch((err) => {
                    reject(err);
                })
            ;
        });
    }



    request(path, postdata, method = "GET") {
        // How to perform a post: https://flaviocopes.com/node-http-post/

        const postDataString = JSON.stringify(postdata) || "";
        let options = {
            hostname: 'cloud.crownstone.rocks',
            port: 443,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postDataString.length
            }
        };

        return new Promise((resolve, reject) => {
            // https://cloud.crownstone.rocks/api/users/login?Content-Type=application/json
            var req = https.request(options, (resp) => {
                let data = '';
    
                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });
    
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    resolve(JSON.parse(data));
                });
            }).on("error", (err) => {
                console.log("Error: " + err.message);
                reject(err);
            });

            // Write post data to server.
            req.write(postDataString);

            // Finish sending the request. Then serve will process this request.
            req.end();
        });
    }
}
module.exports = CrownstoneAPI;