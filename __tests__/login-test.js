import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Login from '../lib/Login'

describe("Login", () => {
  beforeEach(()=>{
    window.firebase = {
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
  })
  it("should be a passing test for setup", () => {

    expect(true).toBe(true)
  })
})
