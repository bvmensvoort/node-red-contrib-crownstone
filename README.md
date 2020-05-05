# node-red-contrib-crownstone
A NodeRED node for accessing data from Crownstone (Bluenet system).

<br>

# Installation
This package is tested on Raspberry Pi 4.

## Pre-requisites
- Crownstones<br>
  These are smart plugs to measure and control wall outlets. Check out [Crownstone rocks](https://crownstone.rocks).
- Bluetooth hardware<br>
  Make sure you have access to Bluetooth hardware.
  If you use Node-Red in a docker, use: Privileged mode on

## Installation
### Via Node-red
- Open Node-red
- Manage palette
- Go to tab Install
- Find Crownstone
- Click install

### Or manually
```
cd ~/.node-red
npm install node-red-contrib-crownstone
```
Restart Node-Red process

<br>

# Usage
<p>
Add Crownstone node in your flow.<br/>
To start the scan, inject <code>msg.payload.scan</code> with <code>true</code>.<br/>
To stop the scan, inject <code>msg.payload.scan</code> with <code>false</code>.
</p>
![Flow example](https://github.com/bvmensvoort/node-red-contrib-crownstone/raw/master/screenshot.png)

<br/>

# Debug
To debug, you can use `node --inspect`.
For example, use Node-Red in a Docker with: `/usr/local/bin/node,--inspect=0.0.0.0:xxxx,/usr/src/node-red/node_modules/node-red/red.js,--,--userDir,/data`.

<br>

# Releases
## V0.0.1
- One node which scans for Crownstones in range
- Will connect to Crownstone cloud to get encryption keys
- Uses email and sha1password to authenticate
- No scanning arguments yet

<br>

# Have suggestions?

Feel free to add a pull request or mention the node.
Thanks for using it (if so)!