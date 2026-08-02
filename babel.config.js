module.exports = function (api) {
  api.cache(true);
  return {
    // NativeWind's docs also list the `nativewind/babel` preset, but it bundles a second
    // `@babel/plugin-transform-react-jsx` on top of the one `babel-preset-expo` already
    // installs for `jsxImportSource` — which fails in dev with "Duplicate __self prop".
    // `jsxImportSource: 'nativewind'` resolves to the very same
    // `react-native-css-interop/jsx-runtime`, and babel-preset-expo adds
    // `react-native-worklets/plugin` on its own, so the preset is redundant here.
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
    plugins: [
      // The one piece `nativewind/babel` contributes that the preset above does not:
      // rewrites `React.createElement` calls so classic-runtime code still gets interop.
      require('react-native-css-interop/dist/babel-plugin').default,
    ],
  };
};
