module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // react-native-dotenv plugin removed - use expo-constants instead
      /*
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
        },
      ],
      */
      // Other plugins can be added here
      'react-native-reanimated/plugin', // Required for react-native-reanimated v2+ if used
    ],
  };
}; 