import React from 'react';
import { render } from 'react-dom';
import {BrowserRouter, Match, Miss } from 'react-router';

import './css/style.css';

import App from './components/App.js';
import notFound from './components/notFound.js'
import StorePicker from './components/StorePicker.js';

const Root = () => {
    return (
        <BrowserRouter>
            <div>
                <Match exactly pattern="/" component={StorePicker} />
                <Match exactly pattern="/store/:storeId" component={App} />
                <Miss component={notFound} />
            </div>
        </BrowserRouter>
    )
}
render(<Root/>, document.getElementById("main"));
