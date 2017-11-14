const { always, pipe, map, merge, trim, zipObj } = require('ramda');
const { exec } = require('child_process');
const { fromCallback } = require('./promise');
const gravatar = require('gravatar');

const execP = cmd => fromCallback(cb => exec(cmd, cb));

exports.identity = Promise.all([
	execP(`dscacheutil -q user -a name $USER | grep gecos | sed 's/gecos: //'`).catch(always('')),
	execP(`git config --get user.name`).catch(always('')),
	execP(`git config --get user.email`).catch(always(''))
]).then(pipe(
	map(trim),
	zipObj(['name', 'gitName', 'gitEmail']),
	data => merge(data, { avatar: data.gitEmail && gravatar.url(data.gitEmail) || null })
));