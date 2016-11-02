import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  getInitialState() {
    return {
      currentUser: {},
      pullActivity: {}
    }
  },
  componentWillMount() {
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        firebase.database().ref("/users/" + user.uid).once("value").then((snapshot)=>{
          var snapshotReturn = snapshot.val()
          this.setState({
            currentUser: snapshotReturn,
          })
        })

      }
    })
    this.loadActivityFeed()
    setInterval(this.loadActivityFeed(), 10000)
  },
  loadActivityFeed() {
    firebase.database().ref("/ironactivity").once("value").then((snapshot)=>{
      var snapshotReturn = snapshot.val()
      this.setState({
        pullActivity: snapshotReturn,
      })
    })
  },
  newActivityUpload(e) {
    e.preventDefault()
    var activityText = this.refs.newActivityText.value
    var newActivityUser = this.state.currentUser.name
    var newActivityUid = this.state.currentUser.uid
    var timeStamp = Date.now()

    var newActivity = {}
    newActivity["/ironactivity/" + timeStamp] = {
      activityOwner: newActivityUser,
      activity: activityText
    }

    var newActivityOwner = {}
    newActivityOwner["/accountactivity/" + newActivityUid + "/" + timeStamp + "/"] = {
      activity: activityText
    }

    firebase.database().ref().update(newActivity)
    firebase.database().ref().update(newActivityOwner)
    this.refs.newActivityText.value = ""
  },
  render() {
    return (
      <div className="dashboard">
        <div className="dashboard__activity">
          <h3>Activity</h3>
          <ul>
            {
              Object.keys(this.state.pullActivity).map((e, id)=>{
                var activityMap = this.state.pullActivity[e]
                return <li key={id}><span>{activityMap.activityOwner}: </span>{activityMap.activity}</li>
              })
            }
          </ul>
          <form onSubmit={this.newActivityUpload}>
            <input className="newActivity" type="text" name="newActivity" ref="newActivityText" autoComplete="off" placeholder="What are you doing, or plan on doing?"/>
            <input className="formSubmit" type="submit" name="submit" value="add"/>
          </form>
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
