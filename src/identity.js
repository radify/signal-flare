const { pipe, map, trim, zipObj } = require('ramda');
const { exec } = require('child_process');
const { fromCallback } = require('./promise');
const execP = cmd => fromCallback(cb => exec(cmd, cb));

exports.identity = Promise.all([
	execP(`dscacheutil -q user -a name $USER | grep gecos | sed 's/gecos: //'`),
	execP(`git config --get user.name`),
	execP(`git config --get user.email`)
]).then(pipe(map(trim), zipObj(['name', 'gitName', 'gitEmail'])));