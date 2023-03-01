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
