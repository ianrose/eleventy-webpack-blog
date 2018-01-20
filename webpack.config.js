module.exports = function(env) {
    return require(`./_config/webpack.${env}.js`);
  }