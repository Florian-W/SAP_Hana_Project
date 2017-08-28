/*
 * Main Server Application utilizing Express 4
 * Author: Nick London <nick.london94@gmail.com>
 */

var express = require('express'), // Main Server Package
	port = process.env.PORT || process.env.VCAP_APP_PORT || 3000, // Vendor independent Port Variable for server
	app = express(), // Server Routing Instance
	api = require('./api'), // API Routing Instance
	login = require('./login'), // Login Configuration Loader
	Promise = require('bluebird'),
	database,
	users,
	conf = {},
	morgan = require('morgan'), // Logging Module
	session = require('express-session'), // Session Manager
	path = require('path'), // Plattform independant File-Path Management
	vcapServices = require('vcap_services'), // VCAP Variable Parser for Service Binding
	https = require('follow-redirects').https, // Extended HTTPS Module for Server Side Requests
	url = require('url'), // URL Parser
	connector = require('./dbconnector'),
	querystring = require('querystring'); // Post Body generator
	

// enable logging
app.use(morgan('combined')); 


// Configure Sessions	
var env = process.env.NODE_ENV || 'dev';

var sessionConf = {
	secret: process.env.sessionSecret  || 'dummy',
	saveUninitialized: true,
	resave: true,
	cookie: { 
		maxAge: 86400000
	}
};

app.set('trust proxy', 1); // trust first proxy

if (env != 'dev') {
	var mongoDbCredentials = vcapServices.getCredentials("mongodb"),
		MongoDBStore = require('connect-mongodb-session')(session),
		store = new MongoDBStore({
			uri: mongoDbCredentials.uri,
			collection: 'sessions'
		},
		function(error) {
			// If Connection failes
			if (error) {
				console.error('DB Connection Failed ', JSON.stringify(error));
				throw error;
			} else console.info('[INFO] Connected to DB successfully');
		});

    store.on('error', function(error) {
      assert.ifError(error);
      assert.ok(false);
    });
	
	sessionConf.store = store;
	
	sessionConf.cookie.secure = true;
	sessionConf.cookie.sameSite = true;
	
	
	connector.DBConnector.factory(mongoDbCredentials.uri).then(db => {
		database = db;
		users = database.collection('users');
		users.setPrimary('email');
	});
	
} else {
	
	sessionConf.cookie.secure = false;
	sessionConf.cookie.sameSite = false;
	
}

app.use(session(sessionConf));
// End session configuration
	
// ensure HTTPS when not on localhost
app.use('/', function(req, res, next) {
	if (req.get('x-forwarded-proto') == 'http' && (req.hostname != "localhost")){
		console.log('Redirect to Secure Connection');
		return res.redirect('https://' + req.hostname + req.url);
	}
	return next();
});

// Generates randome GUID - only used for "unguessable" string combinations
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
	  .toUpperCase();
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function UriFactory(config, token){
	var that = config;
	var opath = that.path;
	var path = that.path;
	
	path += "?" + Object.keys(that.setKeys).map((key) => { 
			if(typeof that.setKeys[key] == Array) return key + "=" + that.setKeys[key].join(encodeURIComponent(" "));
			else return key + "=" + encodeURIComponent(that.setKeys[key]); 
		}).join('&');
		
	path = path + ((path.slice(-1) == "?") ? "" : "&") + that.redirect + '=' + that.redirectUri;
	
	var stateVal;
	
	if (that.stateKey !== undefined){
		stateVal = guid();
		path += (path == opath ? "" : "&") + that.stateKey + "=" + stateVal;
	}
	
	if (that.tokenKey !== undefined && token !== undefined){
		path += (path == opath ? "" : "&") + that.tokenKey + "=" + token;
	}
	
	return [path, stateVal];
}

app.get('/authorize/:service', function(req, res){
	"use strict";
	if(req.params.service && login.extensions && login.extensions[req.params.service]) {
		var that = login.extensions[req.params.service];
		var conf = {
			redirectUri: encodeURIComponent([ (env == 'dev' ? 'http' : 'https') + ":", "", req.hostname + (env == 'dev' ? ':3000' : ''), "authorized", req.params.service, ""].join('/'))
		}; 
		Object.assign(conf, that);
		var [path, state] = UriFactory(conf);
		if (state !== undefined) {
			req.session[req.params.service + '_state'] = state;
		}
		req.session.save((err) => {
			if (err) res.status(500).end();
			else res.redirect(path);
		});
	} else res.status(501).end();
});

app.get('/authorized/:service', function(req, res) {
	if(req.params.service && login.extensions && login.extensions[req.params.service]) {
		req.session.reload(function(err) {
			var that = login.extensions[req.params.service];
			if (
				(!that.stateKey) || 
				(
					req.query[that.stateKey] &&
					req.session[req.params.service + '_state'] && 
					req.query[that.stateKey] == req.session[req.params.service + '_state']
				)
			){
				if(req.query[that.response.error]) res.status(500).end(that.response.error);
				else if (req.query[that.response.token]){
					var uri = url.parse(that.tokenExchange.path),
						data = {};
					Object.assign(data, that.tokenExchange.setKeys);
					data[that.tokenExchange.tokenKey] = req.query[that.response.token];
					data[that.tokenExchange.redirect] = [ (env == 'dev' ? 'http' : 'https') + ":", "", req.hostname + (env == 'dev' ? ':3000' : ''), "authorized", req.params.service, ""].join('/');
					if (that.tokenExchange.propagateState) data[that.tokenExchange.state] = req.session[req.params.service + '_state'];
					data = querystring.stringify(data);
					
					var post = https.request({
						
						protocol: uri.protocol,
						host: uri.host,
						path: uri.path,
						port: 443,
						method: 'POST',
						headers: Object.assign({
							'Content-Type': 'application/x-www-form-urlencoded',
							'Content-Length': Buffer.byteLength(data)
						}, (that.mandatoryHeaders ? that.mandatoryHeaders : {}))
						
					}, response => {
						
						var buffer = [];
						response.on('data', chunk => {
							
							buffer.push(chunk);
							
						}).on('end', () => {
							
							var body = Buffer.concat(buffer).toString();
							var result = JSON.parse(body);
							
							req.session.accessToken = result[that.tokenExchange.response.accessToken];
							
							req.session.save(() => {
								var uri = url.parse(that.emailRetrieve.path + "?" + that.emailRetrieve.accessToken + "=" + req.session.accessToken);
								https.get({
									protocol: uri.protocol,
									host: uri.host,
									path: uri.path,
									port: 443,
									method: 'GET',
									headers: (that.mandatoryHeaders ? that.mandatoryHeaders : {})
								}, response => {
									var buffer = [];
									
									response.on('data', chunk => {
								
										buffer.push(chunk);
								
									}).on('end', () => {
										
										var body = Buffer.concat(buffer).toString();
										console.log(body);
										var result = JSON.parse(body);
																				
										var path = that.emailRetrieve.response.email.split(/[\[\]\.]/g).filter(function(value){return value != "";});
										
										for (var i = 0; i < path.length; i++){
											result = result[path[i]];
										}
										
										if (users || env !== 'dev')
										users.find({email: result}).then(result => {
											// TODO if need to save values to session
										}).catch(err => {
											var user = {email: result};
											user[req.params.service] = {token: req.session.accessToken};
											users.insert(user);
										}).finally(() => {
											req.session.email = result;
											req.session.save(function(err) {
												if (err) res.status(500).end();
												else res.render('sites/login.ejs');
											});
										});
										else {
											req.session.email = result;
											req.session.save(function(err) {
												if (err) res.status(500).end();
												else res.render('sites/login.ejs');
											});
										}
									});
									
								});
							});
						}).on('error', function(err) {res.status(500).end("Token Exchange Failed");});
					});
					
					post.write(data);
					post.end();
				} else res.status(500).end("Something went wrong");
			} else res.status(403).end();
		});
	} else res.status(501).end();
});	

app.post('/logout', function(req, res){
	req.session.reload(function(err) {
		var body = querystring.parse(req.body);
		if(err) res.status(500).end();
		else if(body.token && req.session.token == body.token) {
			req.session.destroy(function(err){
				if(err) res.status(500).end();
				else res.status(200).end();
			});
		} else {
			res.status(403).end();
		}
	}); 
});

// route the api module to host:port/api
app.use('/api/', api);

// route the components loaded via bower to host:port/lib
app.use('/lib/', express.static(path.resolve(__dirname, '../bower_components') + path.sep));
console.info('[INFO] Setting bower static router to %s', path.resolve(__dirname, '../bower_components') + path.sep);

// Index View 
app.set('view engine', 'ejs');
app.use('/', function(req, res, next){
	conf.logins = Object.keys(login.extensions);
	if(req.path == '/' || req.path == '/index.html') 
		req.session.reload(function(err) {
			if(!(err) && req.session.email === undefined) res.render('sites/overview.ejs', conf);
			else res.render('sites/overview.ejs', conf);
		});
	else return next();
});

// route server root requests to static folder
app.use('/', express.static(path.resolve(__dirname, 'static') + path.sep));
console.info('[INFO] Setting default static router to %s', path.resolve(__dirname, 'static') + path.sep);
	
// start server and export instance as module
var exports = module.exports = app.listen(port, function(){
	console.info('[INFO] Express Server listening on Port %s.', port);
});