var paddle = require('..');

paddle({
  entry: './lib/a',
  basedir: __dirname,
}, function(err, content) {
  if (err)
    console.error(err.message);
  else
    console.log('done!');
});

