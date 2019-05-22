import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';

class BasicTest extends React.Component {
	constructor(props) {
		super(props);

		const authUrl = 'https://login.microsoftonline.com/common';
		const scopes = [
			'files.readwrite',
			'files.readwrite.all',
			'offline_access'
		];

		let onedrive = {
			id: undefined,
			content: {}
		};

		this.state = {
			token: undefined,
			token_refresh: undefined,
			token_expired: undefined,
			code: undefined,
			client_id: '013aead5-41f9-4251-8dab-fac68083aa85',
			client_secret: 'cfRSE6192)@$zkashHJVL8]',
			redirect_uri: 'https://192.168.2.60:8081',
			scopes: {scopes},
			onedrive: onedrive
		};

		this.onedrive = onedrive;

		this.msal = new Msal.UserAgentApplication({
			auth: {
				clientId: this.state.client_id,
				authority: authUrl,
				redirectUri: 'https://abc.com/common/oauth2/nativeclient' 
			},
			cache: {
				cacheLocation: "localStorage",
				storeAuthStateInCookie: true
			}
		});

		if(typeof Array.isArray === 'undefined'){
			Array.isArray = obj => Object.prototype.toString.call(obj) === '[object Array]';
		}
	}

	componentDidMount() {
		/* TODO */
	}

	showMessage(msg) {
		console.log(this.JSON2String("", JSON.parse(msg), 0));
	}

	xhr(url, token, cb) {
		let self = this;
		let xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function(){
			let res = undefined;

			if(this.status !== 200)
				return console.log("Status not OKAY!!");
			if(this.readyState !== 4)
				return console.log("ReadyState not OKAY!!");

//			self.showMessage(this.responseText);
			res = JSON.parse(this.responseText);
			console.log(res)
			cb(res);
		}

		xhr.open('GET', url, true);
		xhr.setRequestHeader('Authorization', 'Bearer ' + token);
		xhr.send(null);
	}

	getDataDes__(value, vi, token, parentO, cb) {
		const url = 'https://graph.microsoft.com/v1.0';
		let i = 0;
		let data = value[vi];
		let pData = {};
		let onedrive = parentO;

		if(typeof data !== 'object')
			return cb();
	
		pData.id = data.id;
		pData.name = data.name;
		if(typeof data.folder === 'object'){
			pData.content = {};
			this.xhr(url+ '/drives/'+ this.onedrive.id+ '/items/'+ data.id+ '/children', token, res => {
				onedrive[data.id] = pData;
				this.getDataDes_(res.value, token, pData.content, () => {
					return this.getDataDes__(value, vi+1, token, onedrive, cb);
				});
			});
		}else if(typeof data.file === 'object'){
			if(data.file.mimeType == 'image/jpeg')
				onedrive[data.id] = pData;
			return this.getDataDes__(value, vi+1, token, onedrive, cb);
		}

	}

	getDataDes_(value, token, parentO, cb) {
		if(!Array.isArray(value))
			return console.log(value);

		this.getDataDes__(value, 0, token, parentO, cb);
	}

	getDataDes(value, token, cb) {
		if(!Array.isArray(value))
			return console.log(value);

		this.getDataDes__(value, 0, token, this.onedrive.content, cb);
	}

	getOneDrive() {
		const token = 'EwBwA8l6BAAURSN/FHlDW5xN74t6GzbtsBBeBUYAASbY+53JhcMVj04mh7mnIRD7qeF68uGFQFebeM1ttA3EVlFpSuDQQ5fwy62txoe4Yq/VrJkw0udkKWdwn+aMztrlZjgHcxYtYWg47Lf4QUcXI4p+FL/UEKCs+Fsia98T8hpfhAqVj33W6xUFXc8aOacfA9tnKGtltvnfTsxAjM1kaovLmuQQVR/Q2U10zyUC1XFf3y5yF8TZ4BjFHU0C4bKBye7xYFgfxQwXkbvf5mklYCkJMRUx4C/UidMmh87t7tBp6820QaZ7k+6O1OFHMjBWpCS6n0/K3Qvnt0cuF4Bk61BUt96hEcibzVBja2OAHMDhomcDcpy+20uIEbkmn1sDZgAACBqE7Nx2f//XQAJSLGtGayiPcBfqVcPFIaDbpZJDiCBTQMLq36XZgZKDJCkfuPPjt9gSwlkVDNzKSv2JCb753qSBTH9XMxhqrzyaRprYHtmeZK7KwkIWgQbVBqZ/hjaCo7+h0BQZ0EL3CKMSs7GGcyZk095/LzoCn9H8HdkYs8Cg1ItfZ6FOqxFpRVdcLkQRcI7z9tDcJ4jYU/9FOIrbdx2UFa3zpEgxdsGPkycxkLvsVNeMiQY0x+IjHRncMGETi4JUnqb446eLGh/aKfYnqPCZo7ejqjGAaqMUM5tMnbs2hzNHKgdltITYFpPHKYW3ODhGh8BGV74gIu47dWJCw8sHNFdtfOfMtDJI0bbYhsDHoo6rADezUg190X9oHAzhnsl/KktmVa/nnOEE+7A89NfaRBSir4R3+5Rc4fNT5SCDdP0iEuJs5kNhN4snnO4n8YA3wsbbsE43SqARgnzJ4C9Ii5KDPp8A+zBTo326IfZhmkBfLEhnaQXODIl+TtFKdwvqJEJ8of7ppn+IeoHo11aUQegvtf+QQZHOxeF1pwxmc+MaFxRXfLGLeY4VD68wY7c09Cm3hVESA8Z9zE8I2TxIwrOTX1V6vg6qL/lEOcseyatiWPaZxpIdKDFeLtYmhsHQFg5iSCwMSf/bFwSJO8a+hmdMOYEiL1L9ZQ0Ilkib9sfAN5A4pHdxngKYpuQo8W77GSLOpvJ5UOYHKvyRXPwPEfgz0eRzHkubwwrgNjECuo859YshW17ocHVUnDLBsExj8WJvTH1HlH15Ag==';
		let self = this;
		const url = 'https://graph.microsoft.com/v1.0';
//		let url = 'https://graph.microsoft.com/v1.0/me/drive/root/children';
//		let url = 'https://graph.microsoft.com/v1.0/drives/d20911b8f055051f/items/D20911B8F055051F!147/children';
		let driveUrl = 'https://graph.microsoft.com/v1.0/me/drive';
		let rooturl = 'https://graph.microsoft.com/v1.0/drives/d20911b8f055051f/root/children';

		this.xhr(url+ '/me/drive', token, (res) => {
			let onedrive = this.onedrive;

			onedrive.id = res.id;
			this.xhr(url+ '/drives/'+ this.onedrive.id+ '/root/children', token, (res) => {
				this.getDataDes(res.value, token, () => {
					console.log(this.onedrive);
					this.setState({onedrive: this.onedrive});
				});
			});
		});
	}

	getToken() {
		let self = this;
		let msal = this.msal;

		msal.acquireTokenSilent(this.state.scopes).then(res => {
			console.log(res);
			self.setState({token: res['accessToken']});
			self.setState({token_expired: res['expiresOn'].getTime()});
		}).catch(err => {
			console.log(err);

			if(this.checkRequires(err.errorCode)){
				msal.acquireTokenPopup(this.state.scopes).then(res => {
					console.log(res);
					self.setState({token: res['accessToken']});
					self.setState({token_expired: res['expiresOn'].getTime()});
				}).catch(err => {
					console.log(err);
				});
			}
		});
	}

	checkRequires(err) {
		if (!err || !err.length) {
			return false;
		}

		return err === "consent_required" ||
			err === "interaction_required" ||
			err === "login_required";
	}

	sendReq() {
		let msal = this.msal;

/*
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

			// Check Cross Domain
			if(winP.location.href.indexOf(window.location.href.split("?")[0].split("#")[0]) > -1){
				console.log("Happy: "+ winP.location.href);
			}else{
				console.log("Fuck: %s", winP.location.href);
			}
		}catch (e){
			console.log(e.message);
			return;
		}
*/

		msal.loginPopup(this.state.scopes).then(res => {
			this.getToken();
		}).catch(err => {
			console.log(err);
		});

	}

	moreChar(c, tNum) {
		let s = "";
		let i = 0;

		for(i=0; i<tNum; i++){
			s += c;
		}
		
		return s;
	}

	JSON2String(key, o, tNum, arr) {
		let self = this;
		let k = undefined;
		let m = "";
		let t = "";

		if(typeof key !== 'string')
			return 'undefined';

		if(typeof o !== 'object')
			return 'undefined';

		if(typeof tNum !== 'number')
			return 'undefined';

		t = this.moreChar('\t', tNum);
		if(Array.isArray(o)){
			if(key != "")
				m += t+ key+ ': [\n';
			else
				m += t+ '[\n';
			for(k=0; k<o.length; k++){
				if(typeof o[k] === 'object'){
					m += this.JSON2String("", o[k], tNum+1);
				}else{
					m += t+ '&#9'+ o[k]+ ',\n';
				}
			}
			m += t+ '],\n';
		}else if(o === null){
			m += t+ key+ ': null,\n';
		}else{
			if(key != "")
				m += t+ key+ ': {\n';
			else
				m += t+ '{\n';
			Object.keys(o).map((ok, oi) => {
				if(typeof o[ok] === 'object'){
					m += self.JSON2String(ok, o[ok], tNum+1);
				}else{
					m += t+ '\t'+ ok+ ': '+ o[ok]+ ',\n';
				}
			});
			m += t+ '},\n';
		}

		return m;
	}

	parseQuery(q) {
		let qArray = q.split('&');
		let qJson = {};
		let i = 0;
		let pair = [];
		let key = undefined;
		let value = undefined;

		for(i=0; i<qArray.length; i++){
			pair = qArray[i].split('=');
			key = pair[0];
			value = pair[1];
			
			qJson[key] = value;
		}

		return qJson;
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
						 <Button color="danger" onClick={() => this.getOneDrive()}>getOnedrive</Button>
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

class TestPo extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			onedrive: this.props.onedrive
		}

		this.onedrive = this.state.onedrive;
		console.log("1");
		console.log(this.onedrive);

	}

	render() {
		this.onedrive = this.state.onedrive;	
		console.log("2");
		console.log(this.onedrive);

		return (
			<div>
			</div>
		);
	}
}

export default BasicTest;

