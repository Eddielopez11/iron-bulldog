import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import ViewProfile from '../lib/ViewProfile'

describe("ViewProfile", () => {
  let viewProfileRendered
  beforeEach(() => {

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

    viewProfileRendered = TestUtils.renderIntoDocument(
      <ViewProfile/>
    )
  })
  it("should have an xbox account edit form", () => {
    let xboxFormEl = TestUtils.scryRenderedDOMComponentsWithClass(viewProfileRendered, "editProfile__form")
    expect(xboxFormEl).toBeDefined()
  })

  it("should have a league of legends edit form", () => {
    let leagueFormEl = TestUtils.scryRenderedDOMComponentsWithClass(viewProfileRendered, "editProfile__form")
    expect(leagueFormEl).toBeDefined()
  })

  it("should have a wow edit form", () => {
    let wowFormEl = TestUtils.scryRenderedDOMComponentsWithClass(viewProfileRendered, "editProfile__form")
    expect(wowFormEl).toBeDefined()
  })
})
