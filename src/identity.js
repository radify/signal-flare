const { always, pipe, map, merge, trim, zipObj } = require('ramda');
const { exec } = require('child_process');
const { fromCallback } = require('./promise');
const gravatar = require('gravatar');

const execP = cmd => fromCallback(cb => exec(cmd, cb));

const commands = [
  `dscacheutil -q user -a name $USER | grep gecos | sed 's/gecos: //'`,
  `git config --get user.name`,
  `git config --get user.email`
]

exports.identity = Promise.all(commands.map(cmd => execP(cmd).catch(always('')))).then(pipe(
	map(trim),
	zipObj(['name', 'gitName', 'gitEmail']),
	data => merge(data, { avatar: data.gitEmail && gravatar.url(data.gitEmail) || null })
));