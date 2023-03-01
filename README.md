homebrew-channel-safe-updater
=============================

This application is a tool helpful in recovering broken or potentially-broken
Homebrew Channel installations. It elevates its own root code execution service,
and allows for Homebrew Channel update/reelevation.

This is necessary when updating webOS 22 TVs from Homebrew Channel versions
older than 0.6.3 (due to a bug in self-update feature on these versions)

In most other situations - it is a potentially useful tool one could use to
avoid having to go through the hassle of setting up and rooting their TV all over
again.

Usage
-----

0. Install application via Homebrew Channel
1. Launch application
2. Wait for its service to get elevated - loading indicator at the bottom of the
   screen should disappear after a couple of seconds. Note that initial startup
   requires correctly set up rooted Homebrew Channel, ie. "Root status" needs
   to be "ok".
3. Application is ready:
    * **Press 1 to update Homebrew Channel to latest published release.**
    * Press 2 to reelevate Homebrew Channel service (ie. when Homebrew Channel
      Settings "Root status" indicates "unelevated", even though your TV
      *should* be rooted)
    * Press 8 to launch emergency **passwordless** root telnet server on port 22.
    * Press 9 to launch /var/lib/webosbrew/startup.sh (startup hooks) - this is
      carried out automatically by Homebrew Channel on startup if its service is
      correctly elevated. (note: this **may** result in an error if your TV has
      already executed startup scripts)
4. If any operation selected above succeeded, you should get a "Finished."
   message in log listing.

Building
--------

```sh
npm install

npm run build
npm run package

# Configure development TV/emulator
node_modules/.bin/ares-setup-device ...

npm run deploy
npm run launch
```
