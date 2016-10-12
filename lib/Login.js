import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  getInitialState() {
    return {
      provider: () => {}
    }
  },
  componentDidMount() {
    this.setState({provider: new this.props.firebaseAuth.auth.GoogleAuthProvider()})
    firebase.auth().onAuthStateChanged((user)=>{
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
        <Link to="/">Home</Link>
        <button className="login__signIn" onClick={this.googleSignInOnClick}>login with google</button>
        <button className="login__signOut" onClick={this.googleSignOutOnClick}>log out</button>
      </div>
    )
  }
})
