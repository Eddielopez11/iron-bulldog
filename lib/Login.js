import React from 'react'
import { Link } from 'react-router'
var provider = new firebase.auth.GoogleAuthProvider()

export default React.createClass({
  componentDidMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var currentUser = {}
        currentUser["/users/" + user.uid] = {
          email: user.displayName,
          name: user.email
        }

        firebase.database().ref().update(currentUser)
      } else {
        // No user is signed in.
      }
    })
  },
  googleSignInOnClick() {
    firebase.auth().signInWithRedirect(provider)
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken
        // ...
      }
      // The signed-in user info.
      var user = result.user
      }).catch(function(error) {
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
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
    }, function(error) {
    // An error happened.
});
  },
  render() {
    return (
      <div>
        <Link to="/">Home</Link>
        <button onClick={this.googleSignInOnClick}>login with google</button>
        <button onClick={this.googleSignOutOnClick}>log out</button>
      </div>
    )
  }
})
