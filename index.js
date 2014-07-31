var path = require('path');
var fs = require('fs');
var through = require('through');
var browserify = require('browserify');

var OUTPUT = '__bundle.js';
var BUNDLE = '__require';

/**
 * @param {Object}
 * @param {Function}
 *
 * Example:
 *
 * var paddle = require('@ali/paddle');
 * paddle({
 *   entry: './lib/file.js',
 *   basedir: '/directory/to/your/module'
 * }, function(err, content) {
 *   console.log('done');
 * });
 *
 */
module.exports = function(opts, done) {
  try {
    if (typeof opts !== 'object') throw new TypeError('opts should be object!');
    if (!opts.basedir) throw new Error('opts.basedir is required!');
    if (!opts.entry) throw new Error('opts.entry is required!');

    if (/^[^.]/.test(opts.entry))
      opts.entry = (process.platform === 'win32' ? '.\\' : '.\/') + opts.entry;

    opts.output = path.join(opts.basedir, OUTPUT);

    var b = browserify({
      entries: opts.entry,
      basedir: opts.basedir,
      require: opts.entry,
      externalRequireName: BUNDLE
    });

    var writer = fs.createWriteStream(opts.output);
    b.bundle().pipe(writer);

    writer.on('finish', function() {
      fs.readFile(opts.output, { encoding: 'utf8' }, function(e, content) {
        content += 'module.exports = ' + BUNDLE + '("' + opts.entry + '")';
        done(null, content);
      });
    });
  } catch(e) {
    done(e);
  }
};
