#!/usr/bin/env node
var zf = require('zone-file');
var fs = require('fs');
const isValidDomain = require('is-valid-domain');
const isIp = require('is-ip');
const { exec } = require("child_process");
const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');
const l = require('stormwinston')('scaffolding-ssl');
const morgan = require('morgan');

const zoneFilePath = "/var/named/replicated-zones/stormint.tk"

const app = express();
const port = process.env.PORT || 3000;
app.use(morgan('combined'));

app.get('/',(req,res) => {
    res.send('Hello world');
});

app.get('/update/:record/:ip/', (req,res)=>{
    console.log(req.params);
    res.send("Will be updating");
})

https.createServer({
    key: fs.readFileSync('./ssl.key'),
    cert: fs.readFileSync('./ssl.crt')
}, app).listen(port,()=>{
    console.log("Listening on port "+port);
});

const incrementSerial = (zfj) =>{
    let serial = zfj.soa.serial;
    let newSerial = serial+1;
    let tmp = zfj;
    tmp.soa.serial = newSerial;
    return tmp;
}

const updateA = (zfj,record,newip) => {
    let a = zfj.a;
    let newa = a.map((el)=>{
        if(el.name===record) {
            return {name: record, ip: newip};
        }
        return el;
    });
    let newzfj = zfj;
    newzfj.a = newa;
    return newzfj;
}

const validateInput= (zoneFilePath,recordName,newIP) => {
    if(!fs.existsSync(zoneFilePath)){
        console.log(zoneFilePath," - file doesn't exist");
        process.exit(-1);
    }

    var lettersNumbers = /^[0-9a-zA-Z\-]+$/;
    if(!recordName.match(lettersNumbers)){
        console.log(recordName," - only letters and numbers in record name");
        process.exit(-1);
    }

    if(!isIp(newIP)){
        console.log(newIP," - invalid IP address");
        process.exit(-1);
    }
}

const updateDomainFile = (record,ip) =>{
    console.log(`TCL: updateDomain -> domain,record,ip`, record,ip);
    let f = fs.readFileSync(zoneFilePath);
    let zoneFileJson = zf.parseZoneFile(f.toString());
    zoneFileJson = incrementSerial(zoneFileJson);
    zoneFileJson = updateA(zoneFileJson,recordName,newIP);
    let newText = zf.makeZoneFile(zoneFileJson);
    fs.writeFileSync(zoneFilePath,newText);
}

const reloadNamed = () =>{
    exec("rndc reload", (error, stdout, stderr) => {
        if (error) {
            console.log(`Error: ${error.message}`);
            process.exit(-1);
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            process.exit(-1);
        }
        console.log(`Success: ${stdout}`);
    });    
}

/*
if (process.argv.length<5){
    console.log("Usage: storm-zone-update zonefile record newip");
    process.exit(-1);
}
let zoneFilePath = process.argv[2];
let recordName = process.argv[3];
let newIP = process.argv[4];

validateInput(zoneFilePath,recordName,newIP);
*/
