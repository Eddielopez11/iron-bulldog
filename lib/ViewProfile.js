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
  leagueAccountSearchHandler(e) {
    e.preventDefault()
    $.getJSON( `https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/eskeleto209?api_key=RGAPI-88ae0def-8e60-4e5e-8e0e-998412963d34`, {}).done((data)=>{
      console.log(data);
    })
  },
  xboxGamertagHandler(e) {
    e.preventDefault()
    $.ajax({
      type: "GET", url: `https://xboxapi.com/v2/2533274965950509/profile`,headers:{
        "x-Auth": "91453611a9caab7d6c99e621294c7dce85a33705"
      },
      contentType: "application/json;charset=utf-8",
      success: (data) => {
      console.log(data);
      }
    })
  },
  wowCharacterSearchHandler(e) {
    e.preventDefault()
    $.getJSON(`https://us.api.battle.net/wow/character/${this.state.realm}/${this.state.character}?fields=pvp&locale=en_US&apikey=egsu52qxrnydzv5cjwe337wduzns4h9s`, {}).done((data)=>{
      console.log(data);
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
        <h1>Profile Page</h1>
        <div>
          <h2>xbox gamertag</h2>
          <form onSubmit={this.xboxGamertagHandler}>
            <input type="text" name="xboxGamertag" placeholder="enter xbox gamertag" ref="xboxGamertag"/>
            <input type="submit" name="submit" value="submit"/>
          </form>
        </div>
        <div>
          <h2>League of Legends</h2>
          <form onSubmit={this.leagueAccountSearchHandler}>
            <input type="text" name="leagueSummoner" placeholder="enter summoner name" ref="summonerName"/>
            <input type="submit" name="submit" value="submit"/>
          </form>
        </div>
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
