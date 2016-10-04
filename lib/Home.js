import React from 'react'
import { Link } from 'react-router'
import $ from 'jquery'


export default React.createClass({
  componentWillMount() {
    $.ajax({
      type: "GET",
      url: `https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=ECBFF95629E3CFA6B6BCA5E0ECECB511&steamid=76561197960435530&relationship=friend`,
      contentType: "application/json",
      success: (response) => {
       var JSONparsed = JSON.parse(response)
       console.log(response);
      }
    })
  },
  render() {
    return (
      <div>
        <h1>home</h1>
      </div>
    )
  }
})
