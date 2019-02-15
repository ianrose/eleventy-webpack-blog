var fs = require('fs');
var rimraf = require('rimraf');

fs.unlink('_data/manifest.json', (err) => {});
rimraf('_site', (err) => {});
rimraf('bundles', (err) => {});
 