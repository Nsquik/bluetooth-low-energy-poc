const { withInfoPlist } = require("@expo/config-plugins");

const withBluetoothCentralBackgroundMode = (config) => {
  return withInfoPlist(config, (mod) => {
    if (!Array.isArray(mod.modResults.UIBackgroundModes)) {
      mod.modResults.UIBackgroundModes = [];
    }

    if (!mod.modResults.UIBackgroundModes.includes("bluetooth-central")) {
      mod.modResults.UIBackgroundModes.push("bluetooth-central");
    }

    return mod;
  });
};

module.exports = withBluetoothCentralBackgroundMode;
