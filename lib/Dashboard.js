import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  render() {
    return (
      <div className="dashboard">
        <Link to="/">Home</Link>
        <Link to="/dashboard" className="ironBulldog"><h1>Iron Bulldog</h1></Link>
        <div className="dashboard__activity">
          <h3>Activity</h3>
        </div>
        <div className="dashboard__friendsDiv">
          <div className="dashboard__friends">
            <h4>friends</h4>
          </div>
          <div className="dashboard__newFriends">
            <h4>similar gamers</h4>
          </div>
        </div>
      </div>
    )
  }
})
