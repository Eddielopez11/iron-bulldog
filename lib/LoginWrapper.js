import React from 'react'
import Login from './Login'

export default React.createClass({

  render() {
    return (
      <Login firebaseAuth={firebase}/>
    )
  }
})
