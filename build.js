import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import Nav from './lib/Nav'
import Home from './lib/Home'
import Dashboard from './lib/Dashboard'
import Login from './lib/Login'
import ViewProfile from './lib/ViewProfile'

render((
  <Home/>
), document.getElementById('app'))
