import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import Nav from './lib/Nav'
import Home from './lib/Home'
import Dashboard from './lib/Dashboard'
import Login from './lib/Login'
import ViewProfile from './lib/ViewProfile'

render((
  <Router history={ hashHistory }>
    <Route path="/" component={ Home }/>
    <Route path="/login" component={ Login }/>
    <Route path="/profile" component={ ViewProfile }/>
    <Route path="/dashboard" component={ Dashboard }/>
  </Router>
), document.getElementById('app'))
