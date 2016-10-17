import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  getInitialState() {
    return {
      provider: () => {},
      logginState: false
    }
  },
  componentDidMount() {
    this.setState({provider: new this.props.firebaseAuth.auth.GoogleAuthProvider()})
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        // User is signed in.
        var userUid = user.uid
        var currentUser = {}
        currentUser["/users/" + user.uid] = {
          email: user.email,
          name: user.displayName,
          uid: userUid
        }

        firebase.database().ref().update(currentUser)
        this.setState({
          logginState: true
        })
      } else {
        // No user is signed in.
        this.setState({
          logginState: false
        })
      }
    })
  },
  googleSignInOnClick() {
    firebase.auth().signInWithRedirect(this.state.provider)
    firebase.auth().getRedirectResult().then((result)=>{
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken
        // ...
      }
      // The signed-in user info.
      var user = result.user

    }).catch((error)=>{
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
        // ...
      });
  },
  googleSignOutOnClick() {
    firebase.auth().signOut().then(()=>{
    // Sign-out successful.
  }, (error)=>{
    // An error happened.
});
  },
  render() {
    return (
      <div>
        <button className={this.state.logginState == false ? "login__signIn" : "login__signIn--hide"} onClick={this.googleSignInOnClick}>sign in with google</button>
        <button className={this.state.logginState == false ? "login__signOut" : "login__signOut--show"} onClick={this.googleSignOutOnClick}>sign out</button>
      </div>
    )
  }
})
