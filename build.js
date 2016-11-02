import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import Nav from './lib/Nav'
import Home from './lib/Home'
import Dashboard from './lib/Dashboard'
import LoginWrapper from './lib/LoginWrapper'
import ViewProfile from './lib/ViewProfile'

render((
  <Router history={ hashHistory }>
    <Route path="/login" component={ LoginWrapper }>
      <Route path="/" component={ ViewProfile }/>
      <Route path="/dashboard" component={ Dashboard }/>
    </Route>
  </Router>
), document.getElementById('app'))
