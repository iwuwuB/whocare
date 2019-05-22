import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import BasicTest from './modules/test';
import HelloTest from './modules/hello';

const root = document.getElementById('app');

render((
	<BrowserRouter>
		<HelloTest />
	</BrowserRouter>
), root);
