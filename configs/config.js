const fs = require('fs');
const ini = require('ini');

const confFile = "/etc/nib/nib.conf";

const config = ini.parse(fs.readFileSync(confFile, 'utf-8'));

module.exports = config;
