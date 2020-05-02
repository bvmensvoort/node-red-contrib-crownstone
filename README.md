# node-red-contrib-crownstone
A NodeRED node for accessing data from Crownstone (Bluenet system).

## Installation
This package is tested on Raspberry Pi 4.

### Pre-requisites
Make sure you have access to Bluetooth hardware.
If you use Node-Red in a docker, use: Privileged mode on

### Installation
*Via Node-red*
* Open Node-red
* Manage palette
* Go to tab Install
* Find Crownstone
* Click install

*Or manually*
`cd ~/.node-red`
`npm install node-red-contrib-crownstone`
Restart Node-Red process

## Usage


## Debug
To debug, you can use `node --inspect`.
For example, use Node-Red in a Docker with: `/usr/local/bin/node,--inspect=0.0.0.0:xxxx,/usr/src/node-red/node_modules/node-red/red.js,--,--userDir,/data`.