import React from 'react'
import { Link } from 'react-router'
import $ from 'jquery'
// Get a reference to the database service
// var database = firebase.database()

export default React.createClass({
  getInitialState() {
    return {
      editProfile: false,
      realm: "",
      character: "",
      summoner: "",
      xboxGamertag: "",
      leagueModal: false,
      wowModal: false,
      xboxModal: false,
      currentUser:{
        leagueAcounts:{},
        wowAccounts: {},
        xboxAccounts: {}
      },
      currentUserEmail: {
        email: "",
        name: "",
        uid: "",
        userInfo: {
          userNickName: "n/a",
          playerStyle: "n/a"
        }
      },
      summonerSearchResults: {},
      usersLeagueCharacters: {
        currentSummonerState:{
          name: "no summoner linked",
          summonerLevel: 0
        }
      },
      wowCharacterSearchResults: {},
      usersWowCharacter:{
        currentWowCharacter: {
          faction: 0,
          level: 0,
          name: "no character linked",
          realm: "n/a",
          thumbnail: "./assets/wowLogo.png"
        }
      },
      xboxSearchResults: {},
      currentUserXbox: {
        currentGamertagResult: {
          Gamertag: "no gamertag linked",
          id: 0,
          XboxOneRep: "n/a",
          GameDisplayPicRaw: "./assets/xbox-one-logo.png"
        }
      },
      currentXboxGames: []
    }
  },
  componentWillMount() {
    this.loadFirebaseUser()
  },
  loadFirebaseUser() {
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        // User is signed in
        firebase.database().ref("/users/" + user.uid).once("value").then((snapshot)=>{
          var snapshotReturn = snapshot.val()
          this.setState({
            currentUserEmail: snapshotReturn
          })
        })

        firebase.database().ref("/userProfiles/" + user.uid).once("value").then((snapshot)=>{
          var snapshotReturn = snapshot.val()
          this.setState({
            currentUser: snapshotReturn
          })
          var userLoggedIn = this.state.currentUser
          var leagueCharacter = null
          if(snapshotReturn.leagueAccounts != undefined) {
            leagueCharacter = userLoggedIn.leagueAccounts[Object.keys(userLoggedIn.leagueAccounts)]
            this.setState({
              usersLeagueCharacters: leagueCharacter
            })
          }
          var xboxProfile = null
          if(snapshotReturn.xboxAccounts != undefined) {
            xboxProfile = userLoggedIn.xboxAccounts[Object.keys(userLoggedIn.xboxAccounts)]
            this.setState({
              currentUserXbox: xboxProfile
            })
            $.ajax({
              type: "GET", url: `https://xboxapi.com/v2/${this.state.currentUserXbox.currentGamertagResult.id}/titlehub-achievement-list`,
              headers:{
                "x-Auth": "91453611a9caab7d6c99e621294c7dce85a33705"
              },
              contentType: "application/json;charset=utf-8",
              success: (data) => {
                var currentXboxAccount = data.titles.slice(0,5)
                this.setState({
                  currentXboxGames: currentXboxAccount
                })
              }
            })
          }
          var wowCharacter = ""
          if(snapshotReturn.wowAccounts != undefined) {
            wowCharacter = userLoggedIn.wowAccounts[Object.keys(userLoggedIn.wowAccounts)]
            this.setState({
              usersWowCharacter: wowCharacter
            })
          }
        })
      } else {
        // No user is signed in
      }
    })
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
  editProfileButton() {
    this.setState({
      editProfile: true
    })
  },
  doneEditingProfile() {
    this.setState({
      editProfile: false
    })
  },
  leagueAccountSearchHandler(e) {
    e.preventDefault()
    $.getJSON( `https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/${this.state.summoner}?api_key=RGAPI-88ae0def-8e60-4e5e-8e0e-998412963d34`, {}).done((data)=>{
      var currentSummonerState = data[this.state.summoner]
      this.setState({
        summonerSearchResults: currentSummonerState,
        leagueModal: true
      })
    })
  },
  saveLeagueResults() {
    var currentSummonerState = this.state.summonerSearchResults
    var currentSummoner = {}
    currentSummoner["/userProfiles/" + this.state.currentUserEmail.uid +"/leagueAccounts/" + `${currentSummonerState.id}/`] = {
      currentSummonerState
    }
    firebase.database().ref().update(currentSummoner)
    this.setState({
      leagueModal: false
    })
    this.loadFirebaseUser()
  },
  closeLeagueResults() {
    this.setState({
      leagueModal: false
    })
  },
  unlinkLeagueAccount() {
    firebase.database().ref("/userProfiles/" + this.state.currentUserEmail.uid + "/leagueAccounts").remove()
      .then(()=>{
        console.log("removed");
      })
      .catch((error)=>{
        console.log("error");
      });
    var currentSummonerState = {
      currentSummonerState: {
        name: "no summoner linked",
        summonerLevel: 0
      }
    }
    this.setState({
      usersLeagueCharacters: currentSummonerState
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
      type: "GET", url: `https://xboxapi.com/v2/xuid/${this.state.xboxGamertag}`,
      headers:{
        "x-Auth": "91453611a9caab7d6c99e621294c7dce85a33705"
      },
      contentType: "application/json;charset=utf-8",
      success: (data) => {
        $.ajax({
          type: "GET", url: `https://xboxapi.com/v2/${data}/profile`,
          headers:{
            "x-Auth": "91453611a9caab7d6c99e621294c7dce85a33705"
          },
          contentType: "application/json;charset=utf-8",
          success: (data) => {
            var currentXboxAccount = data
            this.setState({
              xboxSearchResults: currentXboxAccount,
              xboxModal: true
            })
          }
        })
      }
    })
  },
  saveXboxResults() {
    var currentGamertagResult = this.state.xboxSearchResults
    var currentGamertag = {}
    currentGamertag["/userProfiles/" + this.state.currentUserEmail.uid +"/xboxAccounts/" + `${currentGamertagResult.id}/`] = {
      currentGamertagResult
    }
    firebase.database().ref().update(currentGamertag)
    this.setState({
      xboxModal: false
    })
    this.loadFirebaseUser()
  },
  closeXboxResults() {
    this.setState({
      xboxModal: false
    })
  },
  unlinkXboxAccount() {
    firebase.database().ref("/userProfiles/" + this.state.currentUserEmail.uid + "/xboxAccounts").remove()
      .then(()=>{
        console.log("removed");
      })
      .catch((error)=>{
        console.log("error");
      });

    var currentGamertagResult = {
        currentGamertagResult: {
          Gamertag: "no gamertag linked",
          id: 0,
          XboxOneRep: "n/a",
          GameDisplayPicRaw: "./assets/xbox-one-logo.png"
        }
      }
    var resetRecentGames = []
    this.setState({
      currentUserXbox: currentGamertagResult,
      currentXboxGames: resetRecentGames
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
      var currentWowCharacter = data
      this.setState({
        wowCharacterSearchResults: data,
        wowModal: true
      })
    })
  },
  saveWowResults() {
    var currentWowCharacter = this.state.wowCharacterSearchResults
    var currentCharacter = {}
    currentCharacter["/userProfiles/" + this.state.currentUserEmail.uid +"/wowAccounts/" + `${currentWowCharacter.name}/`] = {
      currentWowCharacter
    }
    firebase.database().ref().update(currentCharacter)
    this.setState({
      wowModal: false
    })
    this.loadFirebaseUser()
  },
  closeWowResults() {
    this.setState({
      wowModal: false
    })
  },
  unlinkWowAccount() {
    firebase.database().ref("/userProfiles/" + this.state.currentUserEmail.uid + "/wowAccounts").remove()
      .then(()=>{
        console.log("removed");
      })
      .catch((error)=>{
        console.log("error");
      });
    var currentWowCharacter = {
      currentWowCharacter: {
        faction: 0,
        level: 0,
        name: "no character linked",
        realm: "n/a",
        thumbnail: "./assets/wowLogo.png"
      }
    }
    this.setState({
      usersWowCharacter: currentWowCharacter
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
  profileInfoFormSubmit(e) {
    e.preventDefault()
    var nickName = this.refs.nickname.value
    var playerCompStyle = this.refs.playStyle.value
    // User is signed in.
    var userInfo = {}
    userInfo["/users/" + this.state.currentUserEmail.uid + "/userInfo"] = {
      userNickName: nickName,
      playerStyle: playerCompStyle
    }
    firebase.database().ref().update(userInfo)
    this.loadFirebaseUser()
  },
  render() {
    var xboxSearchResult = this.state.xboxSearchResults
    var wowSearchResult = this.state.wowCharacterSearchResults
    var summonerSearchResult = this.state.summonerSearchResults
    var wowCharacterState = this.state.usersWowCharacter.currentWowCharacter
    var leagueCharacterState = this.state.usersLeagueCharacters.currentSummonerState
    var xboxCharacterState = this.state.currentUserXbox.currentGamertagResult
    return (
      <div>
        <div className="profile__userProfile">
          <button className={this.state.editProfile === false ? "editProfileButton" : "editProfileButton editProfileButton--hide"} onClick={this.editProfileButton}>edit profile</button>
          <button className={this.state.editProfile === false ? "editProfileDoneButton" : "editProfileDoneButton editProfileDoneButton--show"} onClick={this.doneEditingProfile}>done</button>
          <h2 className="profile__pageHeader">{this.state.currentUserEmail.email}</h2>
          <h2>nickname: {this.state.currentUserEmail.userInfo.userNickName}</h2>
          <h2>playstyle: {this.state.currentUserEmail.userInfo.playerStyle}</h2>
          <form className={this.state.editProfile === false ? "editProfile__form" : "editProfile__form editProfile__form--show"} onSubmit={this.profileInfoFormSubmit}>
            <input type="text" name="nickname" placeholder="enter nickname" ref="nickname"/>
            <select ref="playStyle">
              <option value="Casual">Casual (for fun)</option>
              <option value="Competetive">Competetive (takes gaming serious)</option>
              <option value="Super Competetive">Super Competetive (losing is not an option!)</option>
              <option value="Pro">Pro (practice for the big leagues)</option>
            </select>
            <input className="formSubmit" type="submit" name="submit" value="save"/>
          </form>
        </div>
        <div className="profile__accountSection">
          <div className="profile__accountLeagueHalf">
            <div className={this.state.leagueModal == false ? "searchReturnModal" : "searchReturnModal searchReturnModal--show"}>
              <button className="exitModalButton" onClick={this.closeLeagueResults}>x</button>
              <div className="modalSearchReturn">
                <h2 className="modalSearchReturnHeader">Is this your summoner?</h2>
                <img className="modalSearchReturnImage" src="./assets/leagueTibbersIcon.png"/>
                <ul className="modalSearchReturnList">
                  <li className="modalSearchReturnListItem">name: <span className="modalSearchReturnListItemSpan">{summonerSearchResult.name}</span></li>
                  <li className="modalSearchReturnListItem">level: <span className="modalSearchReturnListItemSpan">{summonerSearchResult.summonerLevel}</span></li>
                </ul>
                <button className="modalSearchReturnSave" onClick={this.saveLeagueResults}>save</button>
              </div>
            </div>
            <button className={this.state.editProfile === false ? "editProfile__unlink" : "editProfile__unlink editProfile__unlink--show"} onClick={this.unlinkLeagueAccount}>unlink account</button>
            <h2 className="profile__accountHeader">League of Legends</h2>
            <div>
              <img className="profile__leagueLogo" src={this.state.usersLeagueCharacters.currentSummonerState.name === "no summoner linked" ? "./assets/leaguelogo.png": "./assets/leagueTibbersIcon.png"} alt=""/>
              <ul className="profile__accountInfoList">
                <li className="profile__accountItem">summoner: <span className="profile__accountInfoItem">{leagueCharacterState.name}</span></li>
                <li className="profile__accountItem">summoner lvl: <span className="profile__accountInfoItem">{leagueCharacterState.summonerLevel}</span></li>
              </ul>
              <h4 className="profile__summonerTopChamps">Main Champions:</h4>
              <div className="profile__topChampsDiv">
                <img className={this.state.usersLeagueCharacters.currentSummonerState.name === "no summoner linked" ?  "profile__summonerTopChampsImgNone":"profile__summonerTopChampsImg"} src={this.state.usersLeagueCharacters.currentSummonerState.name === "no summoner linked" ? "":"./assets/Yorick_Square_0.png"} alt="not linked" />
                <img className={this.state.usersLeagueCharacters.currentSummonerState.name === "no summoner linked" ?  "profile__summonerTopChampsImgNone":"profile__summonerTopChampsImg"} src={this.state.usersLeagueCharacters.currentSummonerState.name === "no summoner linked" ? "":"./assets/Ahri_Square_0.png"} alt="not linked" />
                <img className={this.state.usersLeagueCharacters.currentSummonerState.name === "no summoner linked" ?  "profile__summonerTopChampsImgNone":"profile__summonerTopChampsImg"} src={this.state.usersLeagueCharacters.currentSummonerState.name === "no summoner linked" ? "":"./assets/Riven_Square_0.png"} alt="not linked" />
              </div>
            </div>
            <div>
              <form className={this.state.editProfile === false ? "editProfile__form" : "editProfile__form editProfile__form--show"} onSubmit={this.leagueAccountSearchHandler}>
                <input type="text" name="leagueSummoner" placeholder="enter summoner name" ref="summonerName" onChange={this.summonerOnChange}/>
                <input className="formSubmit" type="submit" name="submit" value="search"/>
              </form>
            </div>
          </div>
          <div className="profile__accountWowHalf">
            <div className={this.state.wowModal == false ? "searchReturnModal" : "searchReturnModal searchReturnModal--show"}>
              <button className="exitModalButton" onClick={this.closeWowResults}>x</button>
              <div className="modalSearchReturn">
                <h2 className="modalSearchReturnHeader">Is this your World of Warcraft character?</h2>
                <img className="modalSearchReturnImage" src={ `https://render-api-us.worldofwarcraft.com/static-render/us/${wowSearchResult.thumbnail}`} alt={wowSearchResult.name}/>
                <ul className="modalSearchReturnList">
                  <li className="modalSearchReturnListItem">name: <span className="modalSearchReturnListItemSpan">{wowSearchResult.name}</span></li>
                  <li className="modalSearchReturnListItem">level: <span className="modalSearchReturnListItemSpan">{wowSearchResult.level}</span></li>
                  <li className="modalSearchReturnListItem">realm: <span className="modalSearchReturnListItemSpan">{wowSearchResult.realm}</span></li>
                  <li className="modalSearchReturnListItem">faction: <span className="modalSearchReturnListItemSpan">{wowSearchResult.faction === 0 ? "Alliance" : "Horde"}</span></li>
                </ul>
                <button className="modalSearchReturnSave" onClick={this.saveWowResults}>save</button>
              </div>
            </div>
            <button className={this.state.editProfile === false ? "editProfile__unlink" : "editProfile__unlink editProfile__unlink--show"} onClick={this.unlinkWowAccount}>unlink account</button>
            <h2 className="profile__accountHeader">World of Warcraft
              Character</h2>
            <div>
              <div>
                <img className="profile__wowCharacterImg" src={wowCharacterState.name == "no character linked" ? wowCharacterState.thumbnail : `https://render-api-us.worldofwarcraft.com/static-render/us/${wowCharacterState.thumbnail}`} alt={wowCharacterState.name}/>
                <ul className="profile__accountInfoList">
                  <li className="profile__accountItem">name: <span className="profile__accountInfoItem">{wowCharacterState.name}</span></li>
                  <li className="profile__accountItem">level: <span className="profile__accountInfoItem">{wowCharacterState.level}</span></li>
                  <li className="profile__accountItem">faction: <span className="profile__accountInfoItem">{wowCharacterState.faction === 0 ? "Alliance" : "Horde"}</span></li>
                  <li className="profile__accountItem">realm: <span className="profile__accountInfoItem">{wowCharacterState.realm}</span></li>
                </ul>
              </div>
              <form className={this.state.editProfile === false ? "editProfile__form" : "editProfile__form editProfile__form--show"} onSubmit={this.wowCharacterSearchHandler}>
                <input type="text" name="realm" placeholder="enter realm name" ref="realmName" onChange={this.realmOnChange}/>
                <input type="text" name="character" placeholder="enter character name" ref="characterName" onChange={this.characterOnChange}/>
                <input className="formSubmit" type="submit" name="submit" value="search"/>
              </form>
            </div>
          </div>
        </div>
        <div className="profile__accountXboxSection">
          <div className={this.state.xboxModal == false ? "searchReturnModal" : "searchReturnModal searchReturnModal--show"}>
            <button className="exitModalButton" onClick={this.closeXboxResults}>x</button>
            <div className="modalSearchReturn">
              <h2 className="modalSearchReturnHeader">Is this your xbox account?</h2>
              <img className="modalSearchReturnImage" src={xboxSearchResult.GameDisplayPicRaw} alt="gamer pic"/>
              <ul className="modalSearchReturnList">
                <li className="modalSearchReturnListItem">gamertag: <span className="modalSearchReturnListItemSpan">{xboxSearchResult.Gamertag}</span></li>
              </ul>
              <button className="modalSearchReturnSave" onClick={this.saveXboxResults}>save</button>
            </div>
          </div>
          <button className={this.state.editProfile === false ? "editProfile__unlink" : "editProfile__unlink editProfile__unlink--show"} onClick={this.unlinkXboxAccount}>unlink account</button>
          <h2 className="profile__accountHeader">Xbox Profile</h2>
          <div>
            <img className="profile__xboxGamerImage" src={xboxCharacterState.GameDisplayPicRaw} alt="gamerpic"/>
            <ol className="profile__accountInfoList">
              <li className="profile__accountItem">gamertag: <span className="profile__accountInfoItem">{xboxCharacterState.Gamertag}</span></li>
              <li className="profile__accountItem">Reputation: <span className="profile__accountInfoItem">{xboxCharacterState.GamertagRep = "GoodPlayer" ? "Good" : "Needs Work"}</span></li>
            </ol>
            <ol className="profile__topXboxGames">
              <h3 className="profile__recentGamesHeader">Recently Played Games</h3>
            {
              this.state.currentXboxGames.map((game, id)=>{
                  return <li className="profile__topGame" key={id}><img className="profile__topGameImage" src={game.displayImage} alt={game.name + " image"}/>{game.name}</li>
                })
            }
            </ol>
            <form className={this.state.editProfile === false ? "editProfile__form" : "editProfile__form editProfile__form--show"} onSubmit={this.xboxGamertagHandler}>
              <input type="text" name="xboxGamertag" placeholder="enter xbox gamertag" ref="xboxGamertag" onChange={this.xboxGamertagOnChange}/>
              <input className="formSubmit" type="submit" name="submit" value="search"/>
            </form>
          </div>
        </div>
      </div>
    )
  }
})
