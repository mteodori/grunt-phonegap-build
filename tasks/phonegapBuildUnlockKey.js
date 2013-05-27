var needle = require("needle"),
    read = require("read");

var doUnlockKey = function(grunt, options, onResult) {
  var query = options.user.token ? '?auth_token=' + options.user.token : '';
  needle.put('https://build.phonegap.com/api/v1/keys/' + options.key.platform + '/' + options.key.id + query, {
    data: {password: options.key.password}
  }, {
    username: options.user.email,
    password: options.user.password,
    timeout: options.timeout
  },
    onResult
  );
}

module.exports = function(grunt) {
  grunt.registerMultiTask("phonegapBuildUnlockKey", "Unlocks a key already uploaded to build.phonegap.com by providing its password", function(args) {
    var opts = this.options({
      timeout: 5000
    });

    var done = this.async(),
        report = function(err, resp, body) {
          if(!err && resp.statusCode == 202) {
            grunt.log.ok("Key unlock successful");
            done();
          } else if (err) {
            grunt.log.fail("Key unlock failed:");
            grunt.log.error("Message: " + err);
            done();
            return false;
          } else {
            grunt.log.fail("Key unlock failed (HTTP " + resp.statusCode + ")");
            grunt.log.error("Message: " + body.error);
            done();
            return false;
          }
        };

    if (!opts.key || !opts.key.id || !opts.key.platform) {
      grunt.log.fail("Please provide a key with id and platform in your options, see https://build.phonegap.com/docs/write_api for details.");
      return false;
    }

    if (!opts.key.password) {
      grunt.log.write('Waiting forever...\n');
      read({ prompt: 'Key password: ', silent: true }, function(er, password) {
        opts.key.password = password;
        doUnlockKey(grunt, opts, report);
      });
    } else {
      doUnlockKey(grunt, opts, report);
    }

  });
}
