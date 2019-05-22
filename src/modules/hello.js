import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';

class HelloTest extends React.Component {
	constructor(props) {
		super(props);

		this.scopes = [
			'files.readwrite',
			'files.readwrite.all',
			'offline_access'
		];
		this.commonUrl = 'https://login.microsoftonline.com/common';
		this.client_id = '013aead5-41f9-4251-8dab-fac68083aa85';
		this.client_secret = 'cfRSE6192)@$zkashHJVL8]';
		this.redirect_uri = 'https://192.168.2.60:8081';
		this.serverUrl = 'https://192.168.2.60:8081';

		this.state = {
			token: undefined,
			token_refresh: undefined,
			token_expired: undefined,
			code: undefined,
		};

		this.msal = new Msal.UserAgentApplication({
			auth: {
				clientId: this.client_id,
				authority: this.commonUrl,
				redirectUri: this.redirect_uri
			}
		});

		if(typeof Array.isArray === 'undefined'){
			Array.isArray = obj => Object.prototype.toString.call(obj) === '[object Array]';
		}
	}

	componentDidMount() {
		/* TODO */
	}

	sendReq() {
		const authUrl = this.commonUrl+ '/oauth2/v2.0/authorize';
		var reqUrl = "";
		var scopes = "";
		var query = "";

		scopes = this.scopes.join(' ');
		query = "?response_type=code"+
				"&client_id="+ this.client_id+
				"&scope="+ scopes+
				"&redirect_uri="+ this.redirect_uri;

		reqUrl = authUrl+ query;

		try {
			const winL = window.screenLeft ? window.screenLeft : window.screenX;
			const winT = window.screenTop ? window.screenTop : window.screenY;

			const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			const l = ((w / 2) - (480 / 2)) + winL;
			const t = ((h / 2) - (600 / 2)) + winT;

			const winP = window.open("about:blank", "_blank", "width=480, height=600, top=" + t + ", left=" + l);
			if(!winP){
				console.log("win.open: what going on?!!");
				return;
			}

			if(winP.focus){
				winP.focus();
			}

			window.openedWindows.push(winP);

			winP.location.href = reqUrl;
			console.log(winP.location.href);
			let intr = setInterval(() => {
				let href = winP.location.href;
				if(href.split("?")[0].split("#")[0] == this.redirect_uri+ '/'){
					console.log(winP.location.href);
					console.log("Got");
					clearInterval(intr);
					winP.close();
				}else{
					console.log(winP.location.href);
					console.log("Wait");
				}
			}, 1000);

		}catch (e){
			console.log(e.message);
			return;
		}

/*
		let self = this;

		msal.loginPopup({scopes: this.scopes}).then(res => {
			console.log(res);

			self.msal.acquireTokenSilent({scopes: self.scopes}).then(res => {
				console.log(res);
				self.setState({token: res['accessToken']});
				self.setState({token_expired: res['expiresOn'].getTime()});

				fetch(this.serverUrl+ '/getToken').then( res => res.json())
				.then( res => {
					console.log(res);
				}).catch( err => {
					console.log(err);
				});
			
			}).catch(err => {
				console.log(err);

				if(self.checkRequires(err.errorCode)){
					msal.acquireTokenPopup({scopes: self.scopes}).then(res => {
						console.log(res);
						self.setState({token: res['accessToken']});
						self.setState({token_expired: res['expiresOn'].getTime()});
					}).catch(err => {
						console.log(err);
					});
				}
			});

		}).catch(err => {
			console.log(err);
		});
*/

	}

	checkRequires(err) {
		if (!err || !err.length) {
			return false;
		}

		return err === "consent_required" ||
			err === "interaction_required" ||
			err === "login_required";
	}

	render() {
		const topStyle = {
			height: '100px'
		};

		return (
			<Container>
				<Row>
					<div style={topStyle} />
				</Row>
				<Row>
					<Col>
						 <Button color="primary" onClick={() => this.sendReq()}>getToken</Button>
					</Col>
					<Col>
						 <Button color="danger">getOnedrive</Button>
					</Col>
					<Col>
						 <Button color="success">primary</Button>
					</Col>
				</Row>
				<Row>
					<Col>
						<p>Token: {this.state.token||""}</p>
						<p>Token_Refresh: {this.state.token_refresh||""}</p>
						<p>Token_Expired: {this.state.token_expired||""}</p>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default HelloTest;

