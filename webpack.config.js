const path=require('path');
const glob=require('glob');

const es6infos=glob.sync(__dirname+'/**/es6info.js',{absolute:true});
const targets=es6infos.flatMap(e=>require(e));
let entries={};
targets.forEach(s=>entries[s.substring(__dirname.length)]=s);
// console.log(es6infos,targets,entries);

module.exports = {
  mode: "development",
  devtool: 'source-map',
  entry: entries,
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            targets: "> 0.2%, defaults",
            presets: [
              [
                '@babel/preset-env',
                {
                  "useBuiltIns": "usage",
                  "corejs": "3.22"
                }
              ]
            ]
          }
        }
      }
    ]
  },
  output: {
    filename: '[name]',
    sourceMapFilename: '[file].map',
    path: path.resolve(__dirname, 'dist'),
  },
};