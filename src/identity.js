const { pipe, map, trim, zipObj, always } = require('ramda');
const { exec } = require('child_process');
const { fromCallback } = require('./promise');
const execP = cmd => fromCallback(cb => exec(cmd, cb));

exports.identity = Promise.all([
	execP(`dscacheutil -q user -a name $USER | grep gecos | sed 's/gecos: //'`).catch(always('')),
	execP(`git config --get user.name`).catch(always('')),
	execP(`git config --get user.email`).catch(always(''))
]).then(pipe(map(trim), zipObj(['name', 'gitName', 'gitEmail'])));