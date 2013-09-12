Energiatieto
============

http://energiatieto.herokuapp.com/

Dependencies
------------

*  [node](http://nodejs.org/) (+npm)
*  [grunt](http://gruntjs.com/)
*  [heroku toolbelt](https://toolbelt.heroku.com/)

**Install*

1.  node and npm (eg. with [homebrew](http://brew.sh/))
2.  grunt cli (_npm install -g grunt-cli_)

Heroku toolbelt is only needed if you need to change deployment parameter etc. Standard deployment is done using a Git push to the heroku Git repository.

Running
-------

After cloning the repo, install all the dependencies:

```
npm install
```

And then run the application with:

```
grunt start
```

This will start the app in *development* mode - running against unconcatenated and unminified source files. To emulate how heroku runs the application, you need [foreman](https://github.com/ddollar/foreman):

```
foreman start
```

Which will start the app in *production* mode. Production mode runs the app against [RequireJS](http://requirejs.org/) optimized JavaScript sources.

**Configuration**

App configuration should be placed either in _config.json_, or passed in as environment variables:

   * **google.maps.api.key**: Google Maps [API key](https://developers.google.com/maps/documentation/javascript/tutorial#api_key)

**Building & testing**

Grunt can run all test suites (node, functional, client) with the following command:

```
grunt functional
```

Functional tests will kick off a node server, and point a PhantomJS instance to it. Client tests will test client-side code on the server with node.js.

**Deployment**

Deployment assumes that a [heroku remote](https://devcenter.heroku.com/articles/git#creating-a-heroku-remote) has been configured for the repository.

```
git remote add heroku git@heroku.com:energiatieto.git
```

```
grunt deploy
```

This will first run [JSLint](http://www.jslint.com/) against the codebase, then perform all tests (see above) and finally run the requirejs optimizer to concat and minify all sources into the _/public/dist_ folder. Then these files will be committed to a separate branch, which is pushed to heroku master.