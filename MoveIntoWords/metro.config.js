const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Required for Firebase JS SDK — adds .cjs file extension support
config.resolver.sourceExts.push('cjs');

// Needed for the Firebase modular SDK tree-shaking
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
