import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Login from '../lib/Login'

describe("Login", () => {
  let loginRendered
  let firebaseAuth

  beforeEach(()=>{

    window.firebase = {
      auth: ()=>{
        return {
          onAuthStateChanged: ()=>{}
        }
      },
      database: ()=>{
        return {
          ref: ()=>{
            return {
              once: ()=>{

              }
            }
          }
        }
      }
    }
    firebaseAuth = {
      auth: {
        GoogleAuthProvider: ()=>{}
      }
    }
    loginRendered = TestUtils.renderIntoDocument(
      <Login firebaseAuth={firebaseAuth}/>
    )
  })
  it("should have a sign in button", () => {
    let signInEl = TestUtils.findRenderedDOMComponentWithClass(loginRendered, "login__signIn")
    expect(signInEl).toBeDefined()
  })

  it("should have a sign out button", () => {
    let signOutEl = TestUtils.findRenderedDOMComponentWithClass(loginRendered, "login__signOut")
    expect(signOutEl).toBeDefined()
  })
})
