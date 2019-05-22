"use strick";

import { URLSearchParams } from 'url';
import http from 'http';
import https from 'https';
import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import compression from 'compression';
import fs from 'fs';
import fetch from 'node-fetch';

var PORT = 8080;
var PORTS = 8081;
var HOST = '192.168.2.60';
var LHOST = '127.0.0.1';

var eps = express();
eps.use(compression());
eps.use(express.static(path.join(__dirname, 'public')));
eps.use(bodyParser.urlencoded({ extended: false }));
eps.use(bodyParser.json());

eps.get('/', (req, res, next) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

var token = "";
var token_refresh = "";
var token_expired = 0;
eps.use('/code', (req, res, next) => {
	var code = undefined;
	var body = undefined;
	var data = undefined;
	var res_ = res;

	code = req.query['code'];
	console.log(code);

	if(code){
		data = {
			grant_type: 'authorization_code',
			redirect_uri: 'https://192.168.2.60:8081/code',
			client_id : '013aead5-41f9-4251-8dab-fac68083aa85',
			client_secret: 'cfRSE6192)@$zkashHJVL8]',
			code: code
		};
		body = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');

		fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
			method: 'POST',
			headers: {
				'Content-type': 'application/x-www-form-urlencoded'
			},
			body: body
		}).then(res => res.json())
		.then(res => {
			console.log(res);
			if(res['error']){
				/* TODO */
			}else{
				console.log(res);
				res['expires_in'] = token_expired;
				res['access_token'] = token;
				res['refresh_token'] = token_refresh;

				console.log();
			}
			res_.redirect('/');
//			res_.sendFile(path.join(__dirname, 'public', 'index.html'));
		});
	}else{
		res.sendFile(path.join(__dirname, 'public', 'index.html'));
	}

});

eps.use('/getToken', (req, res, next) => {
	res.send("hello");

});

var httpsOpt = {
	key: fs.readFileSync(__dirname+ '/ca/privatekey.pem'),
	cert: fs.readFileSync(__dirname+ '/ca/certificate.pem')
};

//var lhttpd = http.createServer(eps).listen(PORT, LHOST);
var httpd = http.createServer(eps).listen(PORT, HOST);
var httpsd = https.createServer(httpsOpt, eps).listen(PORTS, HOST);

//lhttpd.on('listening', function(){
//	console.log('Http server running at http//:'+LHOST +':' +PORT);
//});

httpd.on('listening', function(){
	console.log('Http server running at http//:'+HOST +':' +PORT);
});

httpsd.on('listening', function(){
	console.log('Https server running at http//:'+HOST +':' +PORTS);
});

