// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);

const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const nodeLibs = require('node-libs-react-native');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 */
const config = {
  resolver: {
    extraNodeModules: {
      ...nodeLibs,
      stream: require.resolve('stream-browserify'),
      // If needed, add 'readable-stream' as a polyfill
      readableStream: require.resolve('readable-stream'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
