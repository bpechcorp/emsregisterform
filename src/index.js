import React from 'react';
import {render} from 'react-dom';

import {Provider} from 'react-redux';
import store from './store';

import Main from './ui/main';


const reactContent = <Provider store={store}><Main message={"hi"} /></Provider>;

render(reactContent, document.getElementById('content'));