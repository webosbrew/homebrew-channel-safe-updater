import 'core-js/stable';
import 'regenerator-runtime';
import 'whatwg-fetch';
import 'webostvjs/webOSTV';

function lunaCall(uri, parameters) {
  return new Promise((resolve, reject) => {
    const s = uri.indexOf("/", 7);
    webOS.service.request(uri.substr(0, s), {
      method: uri.substr(s + 1),
      parameters,
      onSuccess: resolve,
      onFailure: (res) => {
        reject(new Error(JSON.stringify(res)));
      },
    });
  });
}

function wait(s) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, s);
  });
}

function log(s) {
  const c = document.querySelector('pre');
  c.innerText += `[${new Date()}] ${s}\n`;
  c.scrollTop = c.scrollHeight;
}

let busy = false;
function updateBusy(b) {
  busy = b;
  document.querySelector('.loading-overlay').style.display = busy ? 'block' : 'none';
}

(async () => {
  try {
    updateBusy(true);
    log('Checking self...');
    const resp = await lunaCall('luna://org.webosbrew.safeupdate.service/status', {});
    if (resp.uid !== 0) {
      log('Elevating...');
      const res = await lunaCall('luna://org.webosbrew.hbchannel.service/exec', {
        command: '/media/developer/apps/usr/palm/services/org.webosbrew.hbchannel.service/elevate-service org.webosbrew.safeupdate.service',
      });
      await lunaCall('luna://org.webosbrew.safeupdate.service/quit', {});
    }
    log("Done. Ready.");
  } catch (err) {
    log(`An error occured: ${err.stack}`);
  } finally {
    updateBusy(false);
  }
})();

document.addEventListener('keyup', async (evt) => {
  let command;
  if (busy) return;
  updateBusy(true);
  try {
    if (evt.which === 49) {
      log("Fetching latest version...");
      const manifestUrl = 'https://github.com/webosbrew/webos-homebrew-channel/releases/latest/download/org.webosbrew.hbchannel.manifest.json';
      const resp = await fetch(manifestUrl);
      const manifest = await resp.json();
      const ipkUrl = new URL(manifest.ipkUrl, manifestUrl);
      log(`Latest version is: ${manifest.version}, installing...`);

      await new Promise((resolve, reject) => {
        webOS.service.request('luna://org.webosbrew.hbchannel.service', {
          method: 'install',
          parameters: {
            ipkUrl: ipkUrl.href,
            ipkHash: manifest.ipkHash.sha256,
            subscribe: true,
          },
          onComplete: (res) => {
            if (res.statusText) {
              log('Install progress: ' + (res.statusText + (res.progress ? ` (${progress}%)` : '')));
            } else {
              log('Install progress: ' + JSON.stringify(res));
            }

            if (res.finished || res.subscribed === false || res.errorCode !== undefined) {
              resolve(res);
            }
          },
        });
      });

      log("Reelevating in 10s... Hold tight.");
      await wait(10000);

      command = '/media/developer/apps/usr/palm/services/org.webosbrew.hbchannel.service/elevate-service';
    } else if (evt.which == 50) {
      command = '/media/developer/apps/usr/palm/services/org.webosbrew.hbchannel.service/elevate-service';
    } else if (evt.which == 56) {
      command = 'PATH=$PATH:/media/developer/apps/usr/palm/services/org.webosbrew.hbchannel.service/bin telnetd -l /bin/sh';
    } else if (evt.which == 57) {
      command = '/var/lib/webosbrew/startup.sh';
    } else {
      return;
    }
    busy = true;
    log(`Executing: ${command}`);
    const res = await lunaCall('luna://org.webosbrew.safeupdate.service/exec', {
      command,
    });

    if (res.stdoutString || res.stderrString) log(`${res.stdoutString} ${res.stderrString}`);

    log('Finished.');
    console.info('event:', evt);
  } catch (err) {
    log(`An error occurred: ${err.message}`);
  } finally {
    busy = false;
    updateBusy(false);
  }
});
