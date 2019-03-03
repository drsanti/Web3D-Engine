
// const __exdir__  = 'ex01-getting-started';
// const __exdir__  = 'ex02-engine-callback';
// const __exdir__  = 'ex03-user-init-function';
// const __exdir__  = 'ex04-configuration-options';
// const __exdir__  = 'ex05-initialization-options';
// const __exdir__  = 'ex06-mesh-manipulation';
// const __exdir__  = 'ex07-body-manipulation';
// const __exdir__  = 'ex08-keyboard-input';
// const __exdir__  = 'ex09-force-impulse';
// const __exdir__  = 'ex10-local-force-impulse';
// const __exdir__  = 'ex11-physics-materials';
// const __exdir__  = 'ex12-show-hide-debug-labels';
// const __exdir__  = 'ex13-raycast-force-impulse';
const __exdir__  = 'ex14-models-assets-loading';

//!!
//!!
const __mode__   = 'app';
//!!
//!!

const config = {
  app: {
    root: 'apps',
    main: __exdir__ + '/index.js'
  },
  dev: {
    main: 'index.js'
  }
}

const path = require('path');
module.exports = {
  entry: (__mode__ === 'app') ? './' + config.app.root + '/src/' + config.app.main  :  './src/' + config.dev.main,
  mode: 'development',
  output: {
    path: path.resolve(__dirname, config.app.root + '/public'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, config.app.root + '/public'),
    compress: true,
    port: 9001,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        loader:'style-loader!css-loader'
      }
    ]
  }
};
