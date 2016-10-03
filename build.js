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
    <Route path="/nav" component={ Nav }>
      <Route path="/" component={ Home }/>
      <Route path="/dashboard" component={ Dashboard }/>
      <Route path="/login" component={ Login } />
      <Route path="/viewprofile" component={ ViewProfile }/>
    </Route>
  </Router>
), document.getElementById('app'))
