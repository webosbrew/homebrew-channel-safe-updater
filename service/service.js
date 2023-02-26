import 'core-js/stable';
import 'regenerator-runtime/runtime';

import packageInfo from './package.json';
import Service from 'webos-service';
import { exec } from 'child_process';
console.info('binding as:', packageInfo);
const service = new Service(packageInfo.name);

// Let's stay safe.
service.activityManager.idleTimeout = 60 * 10;

service.register('status', (message) => {
  message.respond({
    uid: process.getuid(),
  });
});

service.register('exec', (message) => {
  const payload = message.payload;
  exec(payload.command, { encoding: 'buffer' }, (error, stdout, stderr) => {
    const response = {
      error,
      stdoutString: stdout.toString(),
      stdoutBytes: stdout.toString('base64'),
      stderrString: stderr.toString(),
      stderrBytes: stderr.toString('base64'),
    };
    if (error) {
      message.respond({ returnValue: false, errorText: error.message, ...response });
    } else {
      message.respond({ returnVaule: true, ...response });
    }
  });
});
