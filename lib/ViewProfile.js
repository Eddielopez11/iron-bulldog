import React from 'react'
import { Link } from 'react-router'
import $ from 'jquery'

export default React.createClass({
  getInitianState() {
    return {
      realm: "",
      character: "",
      wowPVPCharacter: {
        battlegroup: "",
        class: "",
        gender: "",
        level: "",
        name: "",
        pvp: {
          brackets: {
            arena2v2: {
              rating: "",
              seasonLost: "",
              seasonPlayed: "",
              seasonWon: "",
              slug: ""
            },
            arena2v2Skirmish: {
              rating: "",
              seasonLost: "",
              seasonPlayed: "",
              seasonWon: "",
              slug: ""
            },
            arena3v3: {
              rating: "",
              seasonLost: "",
              seasonPlayed: "",
              seasonWon: "",
              slug: ""
            },
            arenaRBG: {
              rating: "",
              seasonLost: "",
              seasonPlayed: "",
              seasonWon: "",
              slug: ""
            },
          }
        },
        race: "",
        realm: ""
      },
      summoner: "",
      xboxGamertag: ""
    }
  },
  urlSpacer(name) {
    var nameArr = name.split(" ")
    var urlFullName = ""
    if(nameArr.length > 1) {
      var urlNameConcat = ""
      nameArr.forEach((e, idx) => {
        if(idx === nameArr.length -1) {
        urlNameConcat += e
        } else {
        urlNameConcat += e + "%20"
        }
      })
      urlFullName = urlNameConcat
    } else {
      urlFullName = name
    }
    return urlFullName
  },
  leagueAccountSearchHandler(e) {
    e.preventDefault()
    $.getJSON( `https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/${this.state.summoner}?api_key=RGAPI-88ae0def-8e60-4e5e-8e0e-998412963d34`, {}).done((data)=>{
      console.log(data);
    })
  },
  summonerOnChange(e) {
    var summonerName = e.target.value

    var urlIfied = this.urlSpacer(summonerName)

    this.setState({
      summoner: urlIfied
    })
  },
  xboxGamertagHandler(e) {
    e.preventDefault()
    $.ajax({
      type: "GET", url: `https://xboxapi.com/v2/xuid/${this.state.xboxGamertag}`,headers:{
        "x-Auth": "91453611a9caab7d6c99e621294c7dce85a33705"
      },
      contentType: "application/json;charset=utf-8",
      success: (data) => {
        $.ajax({
          type: "GET", url: `https://xboxapi.com/v2/${data}/profile`,headers:{
            "x-Auth": "91453611a9caab7d6c99e621294c7dce85a33705"
          },
          contentType: "application/json;charset=utf-8",
          success: (data) => {
          console.log(data);
          }
        })
      }
    })
  },
  xboxGamertagOnChange(e) {
    var xboxGamertagName = e.target.value

    var urlIfied = this.urlSpacer(xboxGamertagName)

    this.setState({
      xboxGamertag: urlIfied
    })
  },
  wowCharacterSearchHandler(e) {
    e.preventDefault()
    $.getJSON(`https://us.api.battle.net/wow/character/${this.state.realm}/${this.state.character}?fields=pvp&locale=en_US&apikey=egsu52qxrnydzv5cjwe337wduzns4h9s`, {}).done((data)=>{
      console.log(data);
    })
  },
  realmOnChange(e) {
    var realmName = e.target.value

    var urlIfied = this.urlSpacer(realmName)

    this.setState({
      realm: urlIfied
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
            <input type="text" name="xboxGamertag" placeholder="enter xbox gamertag" ref="xboxGamertag" onChange={this.xboxGamertagOnChange}/>
            <input type="submit" name="submit" value="submit"/>
          </form>
        </div>
        <div>
          <h2>League of Legends</h2>
          <form onSubmit={this.leagueAccountSearchHandler}>
            <input type="text" name="leagueSummoner" placeholder="enter summoner name" ref="summonerName" onChange={this.summonerOnChange}/>
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
