'use strict';
import React from 'react'
import ReactDom from 'react-dom'
import ReactSelect from 'react-select'
import Sidebar from './sidebar'

const domContainer = document.querySelector('#react-container');
ReactDom.render(<Sidebar/>,  domContainer);

