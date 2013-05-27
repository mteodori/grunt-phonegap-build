# grunt-phonegap-build
This is a grunt-task to upload a ZIP archive to [build.phonegap.com](http://build.phonegap.com) and trigger a new build.

## Current version & development
The current version is **0.0.6**, this project is in **BETA** and under **active** development.

##Configuration
First of all, you need a ZIP file, containing the contents of the PhoneGap app to be built. This can be created using [grunt-zipstream](https://github.com/Two-Screen/grunt-zipstream) for example.
The ZIP file should have the "index.html" and the ["Config.xml"](http://build.phonegap.com/docs/config-xml) in the root level and all required resources below, for example:

    ├── Config.xml
    ├── css
    │   ├── app.css
    │   ├── foundation.min.css
    │   ├── lungo.css
    │   ├── lungo.icon.brand.css
    │   ├── lungo.icon.css
    │   └── theme.lungo.css
    ├── icon.png
    ├── js
    │   ├── app.js
    │   ├── controller.js
    │   ├── directives.js
    │   ├── filters.js
    │   ├── services.js
    ├── images
    │   └── background.jpg
    ├── index.html

Then, some configuration for phonegap-build is needed:

### General options
 2. ```appId```: The App ID of the application on build.phonegap.com (see details of your app there to get it)
 3. ```user```: The email and password or the Github authentication token (all three optional) you log in with on build.phonegap.com. If you leave out your password it will prompt you when grunt runs.
 4. ```timeout```: (optional, default: 5 seconds) a timeout. You may need to increase this value if you are trying to upload a large app or have a slow connection.

### For file-based applications (using a *.zip file)
 1. ```archive```: The path (or filename, if it's in the same directory as the Gruntfile) to the ZIP archive
 
### For repository-based applications (using a github repository)
1. ```isRepository```: True to set the build method to "pull from repository"

That's all. Once you configured the build-phonegap, you can run

    $ grunt phonegap-build
or if you have a "zip" target to create the archive before:

    $ grunt zip phonegap-build

to create a new build.
**Note:** This is a multitask, so you can specify different configurations for it (e.g. test and production). You need to specify at least one configuration
Here is an example for a Gruntfile.js:

    module.exports = function(grunt) {

      // Project configuration.
      grunt.initConfig({
        "phonegap-build": {
          debug: {
            options: {
              archive: "app.zip",
              "appId": "1234",
              "user": {
                "email": "your.email@example.org",
                "password": "yourPassw0rd"
              }
            }
          },
          release: {
            options: {
              "isRepository": "true",
              "appId": "9876",
              "user": {
                "token": "ABCD123409876XYZ"
              }
            }
          }
        },
        zip: {
          app: {
            file: {
              src: ["index.html", "js/**/*.js", "css/**/*.js", "icon.png", "images/background.jpg"],
              dest: "app.zip"
            }
         }
        }
      });

      // Load tasks.
      grunt.loadNpmTasks('grunt-zipstream');
      grunt.loadNpmTasks('grunt-phonegap-build');

      // Default task.
      grunt.registerTask('default', 'zip phonegap-build:debug');
    };
This example also aliased

    $ grunt
to run "zip" and then "phonegap-build" for you.

### To unlock a certificate key
If the build requires signing, another task is available to unlock its key, to be performed before, for example:

    $ grunt phonegapBuildUnlockKey phonegap-build

Additional configuration is required:

 1. ```key.id```: The Key ID of the uploaded signing key on build.phonegap.com.
 2. ```key.platform```: The platform the key refers to, i.e. ios, android, etc.
 3. ```key.password```:  The password to unlock the key, if left out a prompt will let you enter it from the command line.
 4. ```user```: authentication like in the *phonegap-build* task, with user and password or just token.
 5. ```timeout```: (optional, default: 5 seconds) a timeout for the connection to build.phonegap.com.
 
**Note:** This is a multitask also, so you can specify different configurations for example for every platform you need.

Here is an example for a Gruntfile.js:

    module.exports = function(grunt) {

      // Project configuration.
      grunt.initConfig({
        phonegapBuildUnlockKey: {
          ios: {
            options: {
              key: {
                id: "5678",
                platform: "ios"
              },
              user: {
                token: "1234567ABCDEFGHI"
              }
            }
          },
        },
 		"phonegap-build": ...,
 		zip: ...
      });

	  // Load tasks.
	  grunt.loadNpmTasks('grunt-zipstream');
	  grunt.loadNpmTasks('grunt-phonegap-build');

	  // Default task.
	  grunt.registerTask('default', 'zip phonegapBuildUnlockKey phonegap-build');
	};

##Reference

PhoneGap API documents: <https://build.phonegap.com/docs/api>
