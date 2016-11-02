import React from 'react'
import Login from './Login'

export default React.createClass({

  render() {
    return (
      <div>
        <Login firebaseAuth={firebase}/>
        {this.props.children}
      </div>
    )
  }
})
