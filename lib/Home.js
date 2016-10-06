import React from 'react'
import { Link } from 'react-router'
import $ from 'jquery'

export default React.createClass({
  getInitianState() {
    return {
      realm: "",
      character: ""
    }
  },
  wowCharacterSearchHandler(e) {
    e.preventDefault()
    $.ajax({
      type: "GET",
      url: `https://us.api.battle.net/wow/character/${this.state.realm}/${this.state.character}?fields=pvp&locale=en_US&apikey=egsu52qxrnydzv5cjwe337wduzns4h9s`,
      contentType: "application/json",
      success: (response) => {
       console.log(response)
      }
    })
  },
  realmOnChange() {
    var realmName = this.refs.realmName.value
    var realmNameSplit = realmName.split(" ")
    var urlRealmName = ""
    if(realmNameSplit.length > 1) {
      var realmAppending = ""
      realmNameSplit.forEach((e, idx) => {
        if(idx === realmNameSplit.length -1) {
        realmAppending += e
        } else {
        realmAppending += e + "%20"
        }
      })
      urlRealmName = realmAppending
    } else {
      urlRealmName = realmName
    }
    this.setState({
      realm: urlRealmName
    })
  },
  characterOnChange() {
    var characterName = this.refs.characterName.value
    this.setState({
      character: characterName
    })
  },
  render() {
    return (
      <div>
        <h1>home</h1>
        <div>
          <h2>world of warcraft character</h2>
          <form onSubmit={this.wowCharacterSearchHandler}>
            <input type="text" name="realm" placeholder="enter realm name" ref="realmName" onChange={this.realmOnChange}/>
            <input type="text" name="character" placeholder="enter character name" ref="characterName" onChange={this.characterOnChange}/>
            <input type="submit" name="submit" value="submit"/>
          </form>
        </div>
      </div>
    )
  }
})
