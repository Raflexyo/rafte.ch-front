import React, {useState, useEffect} from "react";
import "../css/SummonerSummary.css";
import { getIdToName } from "../functions/ChampionsID";
import { map, spell, rune, posToReal } from "../functions/Map&SR";
import { timeElapsedString } from "../functions/Time"
import { Link } from "react-router-dom";
import {RiArrowDownSLine} from "react-icons/ri";
import TogetherPlay from "../items/TogetherPlay";
import ChampsPlayed from "../items/ChampsPlayed";
import { useLocation } from "react-router-dom";
import GamesSummary from "../items/GamesSummary";
import {AiOutlineExclamationCircle} from "react-icons/ai";
import SummonerRank from "../items/SummonerRank";
import Build from "../items/Build";
import Details from "../items/Details";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { hosting } from "../Hosting";

export default function SummonerSummary({ summonerInfo, summonerRank, matches, barRegion, summonerName, setMatches }) {

  const [numDisplayed, setNumDisplayed] = useState(20);
  const [loading, setLoading] = useState(false);
  
  function handleShowMore() {
    setNumDisplayed(prevState => prevState + 20);
  }
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${hosting}/summoner/${barRegion}/${summonerName}/matches`, {
          params: {
            start: 0,
            count: numDisplayed
          }
        });
  
        const newMatches = response.data.matches;
        setMatches(newMatches);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [barRegion, summonerName, numDisplayed, setMatches]);


  const [showAdditionalInfoIndex, setShowAdditionalInfoIndex] = useState(-1);
  const toggleAdditionalInfo = (index) => {
    setShowAdditionalInfoIndex(showAdditionalInfoIndex === index ? -1 : index);
  };

  const gameCreated = matches.map((match) => {
    const gameCreat = match.match.info.gameEndTimestamp / 1000;
    return timeElapsedString(`${gameCreat}`);
  })

  const summImg = matches.map((match) => {
    const participant = match.match.info.participants.find(p => p.puuid === summonerInfo.puuid);
    if (participant) {
      const championImg = participant.championId;
      return getIdToName(championImg);
    }
    return null;
  });
  
  const didSummWin = matches.map((match) => {
    const participant = match.match.info.participants.find(p => p.puuid === summonerInfo.puuid);
    if (participant) {
      const { win, gameEndedInEarlySurrender: remake } = participant;
      return remake ? "Remake" : win ? "Victory" : "Defeat";
    }
    return null;
  });

  const gameDuration = matches.map((match) => {
    const gameDur = match.match.info.gameDuration;
    const min = Math.floor(gameDur/60);
    const sec = gameDur-(min*60);
    return `${String(min).padStart(2, '0')}m ${String(sec).padStart(2, '0')}s`;
  });


  const summonerRankInfo = [];


  matches.map((match) => {
    const participant = match.match.info.participants.find(p => p.puuid === summonerInfo.puuid);
    if (participant) {
      const champLvl = participant.champLevel;
      const sumSt = participant.summoner1Id;
      const sumNd = participant.summoner2Id;
      const runSt = participant.perks.styles[0].selections[0].perk;
      const runNd = participant.perks.styles[1].style;
      const item1 = participant.item0;
      const item2 = participant.item1;
      const item3 = participant.item2;
      const item4 = participant.item3;
      const item5 = participant.item4;
      const item6 = participant.item5;
      const item7 = participant.item6;
      const item8 = participant.item7;
      const kills = participant.kills;
      const assists = participant.assists;
      const deaths = participant.deaths;

      let kda = "";
      if(deaths === 0){
         kda = "Perfect KDA";  
      }else{
        let kdaa = ((kills+assists)/deaths).toFixed(2);
        kda = kdaa + ":1 KDA"
      }

      let summonerTeam = participant.teamId;
      let totalKills = null;
      if(summonerTeam === 100){
        totalKills = match.match.info.teams[0].objectives.champion.kills; 
      }else{
        totalKills = match.match.info.teams[1].objectives.champion.kills;
      }



      let mvp = null;
      if(kills+assists>(totalKills/2)){
        mvp = "MVP";
      }

      let killParticipation = null;
      if(totalKills === 0){
        killParticipation = "0%";
      }else
        killParticipation = (((kills+assists)/totalKills)*100).toFixed(0) + "%";

      let avgTier = null;
        if(summonerRank[0]?.tier){
          avgTier = summonerRank[0]?.tier;
        };

      const wards = participant.visionWardsBoughtInGame;
      const gameDur = match.match.info.gameDuration;
      const min = Math.floor(gameDur/60);
      const sec = gameDur-(min*60);
      const time = min * 60 + sec;
      const timecs = Math.round(time/60, 1);   
      const minions = participant.totalMinionsKilled;
      const monsters = participant.neutralMinionsKilled;
      const cs = minions + monsters; 
      const csp = cs/timecs;
      const cspm = csp.toFixed(1);
      const dkill = participant.doubleKills;
      const tkill = participant.trippleKills;
      const qkill = participant.quadraKills; 
      const pkill = participant.pentaKills;
      let resultKill = null;
      switch(true) {
        case pkill > 0:
          resultKill = "PENTAKILL!";
          break;
        case qkill > 0:
          resultKill = "Quadra kill";
          break;
        case tkill > 0:
          resultKill = "Triple kill";
          break;
        case dkill > 0:
          resultKill = "Double kill";
          break;
        default: resultKill = null;
      }

      const position = participant.individualPosition;

      const array = [
        champLvl, sumSt, sumNd, runSt, runNd,
        item1, item2, item3, item4, item5,
        item6, item7, item8, kills, assists,
        deaths, kda, wards, cspm, resultKill,
        totalKills, mvp, killParticipation, cs,
        avgTier, position, timecs
      ];
      summonerRankInfo.push({
        key: summonerRankInfo.length,
        values: array
      });

    };
    return null;
  });

  const color = "#85417c";

  const sumName = summonerInfo.name;
  const location = useLocation();
  
  useEffect(() => {
    const teamWraps = document.querySelectorAll(".teamWrap");
    teamWraps.forEach((teamWrap) => {
      const summonerName = teamWrap.querySelector("li").innerText;
      const serializedSumName = new Intl.Collator(undefined, {caseFirst: "false", sensitivity: "base"}).compare(sumName.normalize("NFC"), summonerName.normalize("NFC")) === 0;
      if (serializedSumName) {
        teamWrap.querySelector("li a").style.fontWeight = "bold";
      } 
    });
  }, [sumName, location]);


  function calculateTotalDamage(matches) {
    let matchMaxDamageArray = [];
    const totalDamageDealt = matches.reduce((total, match) => {
      const maxDamage = match.match.info.participants.reduce((max, participant) => {
        const damageDealt = participant.totalDamageDealtToChampions;
        return damageDealt > max ? damageDealt : max;
      }, 0);
      matchMaxDamageArray.push(maxDamage);
      return total + maxDamage;
    }, 0);
    return { totalDamageDealt, matchMaxDamageArray };
  }
  const { matchMaxDamageArray } = calculateTotalDamage(matches);
  

  function calculateDamageTaken(matches) {
    let matchDamageTaken = [];
    const totalDamageTaken = matches.reduce((total, match) => {
      const maxDamage = match.match.info.participants.reduce((max, participant) => {
        const damageDealt = participant.totalDamageTaken;
        return damageDealt > max ? damageDealt : max;
      }, 0);
      matchDamageTaken.push(maxDamage);
      return total + maxDamage;
    }, 0);
    return { totalDamageTaken, matchDamageTaken };
  }  
  const { matchDamageTaken } = calculateDamageTaken(matches);


  const [activeSection, setActiveSection] = useState("overview");

  const handleButtonClick = (section) => {
    setActiveSection(section);
  };

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  return (
    <div className="summonerSummmaryWrapper">
      <div className="summonerSummary">
          <div className="leftSideSummary">
            
            <div className="contentWrapper">
            <GamesSummary matches={matches} summonerInfo={summonerInfo}/>
            <SummonerRank summonerRank={summonerRank}/>
            <ChampsPlayed matches={matches} summonerInfo={summonerInfo}/>
            <TogetherPlay matches={matches} summonerInfo={summonerInfo} barRegion={barRegion}/>
            </div>
          </div>
          {matches && matches.length > 0 ? (
            <div className="rightSideSummary">
              <div className="summonerGames">
                {matches.slice(0, numDisplayed).map((match, index) => (
                  <div className={`rankedWrapper ` + didSummWin[index]}  key={index}>
                    <div className="gameInfo" >
                      <div className="gameContent">
                        <div className="leftInfo">
                          <div className="groupItems">
                          <span className="mapName">{map(match.match.info.queueId)}</span>
                          <span className="whenPlayed">{gameCreated[index]}</span>
                          </div>
                          <div className="groupItems">
                          <span className={`gameResult `+didSummWin[index]}>{didSummWin[index]}</span>
                          <span className="gameDuration">{gameDuration[index]}</span>
                          <button onClick={() => toggleAdditionalInfo(index)} className="buttonShowMore"><RiArrowDownSLine/></button>
                          </div>                        
                        </div>
                        <div className="middlePart">

                        <div className="MidTop">
                          <div className="middlePartImage">
                            <img alt={summImg[index]} src={`https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/${summImg[index]}.png`}></img>
                            <span className="championLevel">{summonerRankInfo[index].values[0]}</span>
                          </div> 

                          <div className="middlePartSpells">
                            <div className="middlePartSpell">
                              <img alt={spell(summonerRankInfo[index].values[2])} src={"/imagesData/champion/spells/" + spell(summonerRankInfo[index].values[2]) + ".png"}></img>
                            </div>
                            <div className="middlePartSpell">
                              <img alt={rune(summonerRankInfo[index].values[3])} src={"/imagesData/champion/runes/" + rune(summonerRankInfo[index].values[3]) + ".png"}></img>
                            </div>
                          </div>   

                          <div className="middlePartRunes">
                            <div className="middlePartRune">
                              <img alt={spell(summonerRankInfo[index].values[1])} src={"/imagesData/champion/spells/" + spell(summonerRankInfo[index].values[1]) + ".png"}></img>
                            </div>
                            <div className="middlePartRune">
                              <img alt={rune(summonerRankInfo[index].values[4])} src={"/imagesData/champion/runes/" + rune(summonerRankInfo[index].values[4]) + ".png"}></img>
                            </div>
                          </div>

                          <div className="middlePartKda">
                          <div className="itemHolders">
                        <ul className="itemsRow">
                          <li className="item"><img width={22} alt={summonerRankInfo[index].values[5]} src={"/imagesData/champion/item/"+ summonerRankInfo[index].values[5]+".png"}></img></li>
                          <li className="item"><img width={22} alt={summonerRankInfo[index].values[6]} src={"/imagesData/champion/item/"+ summonerRankInfo[index].values[6]+".png"}></img></li>
                          <li className="item"><img width={22} alt={summonerRankInfo[index].values[7]} src={"/imagesData/champion/item/"+ summonerRankInfo[index].values[7]+".png"}></img></li>
                          <li className="item"><img width={22} alt={summonerRankInfo[index].values[8]} src={"/imagesData/champion/item/"+ summonerRankInfo[index].values[8]+".png"}></img></li>
                          <li className="item"><img width={22} alt={summonerRankInfo[index].values[9]} src={"/imagesData/champion/item/"+ summonerRankInfo[index].values[9]+".png"}></img></li>
                          <li className="item"><img width={22} alt={summonerRankInfo[index].values[10]} src={"/imagesData/champion/item/"+ summonerRankInfo[index].values[10]+".png"}></img></li>
                          <li className="item"><img width={22} alt={summonerRankInfo[index].values[11]} src={"/imagesData/champion/item/"+ summonerRankInfo[index].values[11]+".png"}></img></li>
                        </ul>
                        </div>
                          </div>

                          <div className="middlePartStats">
                            <div className="stats">
                              <div>
                                <div className="kda">
                                  <span className="kdafont">{summonerRankInfo[index].values[13]}</span> / <span className="deaths kdafont">{summonerRankInfo[index].values[15]}</span> / <span className="kdafont">{summonerRankInfo[index].values[14]}</span>
                                </div>
                                <div className="ratio">
                                  <span>{summonerRankInfo[index].values[16]}</span>
                                </div>
                                <span>P/Kill {summonerRankInfo[index].values[22]}</span>
                              </div>
                              <div className="statusValues">
                                <span>Vision wards {summonerRankInfo[index].values[17]}</span>
                                  <div>
                                    <span>CS {summonerRankInfo[index].values[23]}</span> <span>({summonerRankInfo[index].values[18]})</span>
                                  </div>
                              </div>
                            </div>
                          </div>

                        </div>

                        <div className="MidBot">
                          <div className="statsRow">
                          {summonerRankInfo[index].values[25] &&(
                            <span className="resultKill">{posToReal(summonerRankInfo[index].values[25])}</span>
                          )}
                          {summonerRankInfo[index].values[19] &&(
                            <span className="resultKill">{summonerRankInfo[index].values[19]}</span>
                          )}
                          {summonerRankInfo[index].values[21] &&(
                            <span className="resultKill">{summonerRankInfo[index].values[21]}</span>
                          )}
                          </div>
                        </div>
                        </div>

                        <div className="middlePart">
                          <div className="summonerWrapper">
                            <ul>
                              <div className="allyTeam">
                                {match.match.info.participants.slice(0,5).map((participant, j) => (
                                  <div className="teamWrap" key={j}>
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/${getIdToName(participant.championId)}.png`} alt={getIdToName(participant.championId)}/>
                                    <li>
                                    <Link onClick={scrollToTop} to={`/summoner/${barRegion}/${participant.summonerName}`}>
                                      {participant.summonerName}
                                    </Link>
                                    </li>
                                  </div>                                  
                                ))}
                              </div>
                            </ul>
                            <ul>
                              <div className="enemyTeam">
                                {match.match.info.participants.slice(5,10).map((participant, k) => (
                                  <div className="teamWrap" key={k}>
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/${getIdToName(participant.championId)}.png`} alt={getIdToName(participant.championId)} />
                                    <li>
                                    <Link onClick={scrollToTop} to={`/summoner/${barRegion}/${participant.summonerName}`}>
                                      {participant.summonerName}
                                    </Link>
                                    </li>
                                  </div>
                                ))}
                              </div>
                            </ul>
                          </div>
                        </div>

                        <button onClick={() => toggleAdditionalInfo(index)} className="showMoreInfo">
                          <RiArrowDownSLine/>
                        </button>    

                      </div>             
                    </div>

{/* TABLE DESKTOP START */}
                    {showAdditionalInfoIndex === index && (
                      <>
                      <div className="additionalInfo">
                        <ul>
                          <li className={activeSection === "overview" ? "activeButton" : null}><button onClick={() => handleButtonClick("overview")}>Overview</button></li>
                          <li className={activeSection === "build" ? "activeButton" : null}><button onClick={() => handleButtonClick("build")}>Build</button></li>
                          <li className={activeSection === "details" ? "activeButton" : null}><button onClick={() => handleButtonClick("details")}>Details</button></li>
                        </ul>
                      </div>

                      {activeSection === "overview" && (
                        <>
                      <div className="infoAboutTeam">
                        <table>
                          <thead>
                            <tr className="topPartTable">
                              <th>Blue Team ({match.match.info.teams[0].win === true?<span className='VicCol'>Victory</span>:<span className='DefCol'>Defeat</span>})</th>
                              <th>KDA</th>
                              <th>Damage</th>
                              <th>CS</th>
                              <th>Item</th>
                            </tr>
                          </thead>

                          <tbody  className={`${match.match.info.teams[0].win === true?"Victory":"Defeat"}`}>
                            {match.match.info.participants.slice(0,5).map((participant, a) => (
                              <tr className="summonerRowT" key={a}>
                                <td>
                                  <div className="topPart">

                                  <div className="imageHolder">
                                    <img className="championImageLow" src={`https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/${getIdToName(participant.championId)}.png`} alt={getIdToName(participant.championId)}></img>
                                    <span className="champLevelLow">{participant.champLevel}</span>
                                  </div>

                                  <div>
                                    <div className="middlePartSpellLow">
                                      <img alt={spell(participant.summoner2Id)} src={"/imagesData/champion/spells/" + spell(participant.summoner2Id) + ".png"}></img>
                                    </div>
                                    <div className="middlePartSpellLow">
                                      <img alt={rune(participant.perks.styles[0].selections[0].perk)} src={"/imagesData/champion/runes/" + rune(participant.perks.styles[0].selections[0].perk) + ".png"}></img>
                                    </div> 
                                  </div>
                                
                                  <div>
                                    <div className="middlePartRuneLow">
                                      <img alt={spell(participant.summoner1Id)} src={"/imagesData/champion/spells/" + spell(participant.summoner1Id) + ".png"}></img>
                                    </div>
                                    <div className="middlePartRuneLow">
                                      <img alt={rune(participant.perks.styles[1].style)} src={"/imagesData/champion/runes/" + rune(participant.perks.styles[1].style) + ".png"}></img>
                                    </div>
                                  </div>

                                  <li className="summonerDataLow">
                                    <Link onClick={scrollToTop} to={`/summoner/${barRegion}/${participant.summonerName}`}>{participant.summonerName}</Link>
                                    <span>{participant.summonerLevel} Lvl</span>
                                  </li>
                              
                                  </div>
                                </td>

                                <td>
                                  <div className="kdaHolder Holder">
                                    <span>
                                      {participant.kills}<span className="garygraygary">/</span><span className="deaths">{participant.deaths}</span><span className="garygraygary">/</span>{participant.assists} <span className="garygraygary">|</span> <span className="deaths"> {match.match.info.teams[0].objectives.champion.kills ? (((participant.kills+participant.assists)/match.match.info.teams[0].objectives.champion.kills)*100).toFixed(0): "0"}%</span>
                                    </span>
                                    <span>
                                      {participant.deaths === 0 ? "Perfect KDA" : ((participant.kills+participant.assists)/participant.deaths).toFixed(2) + ":1 KDA"}
                                    </span>
                                  </div>
                                </td>

                                <td>
                                  <div className="damageHolder Holder">
                              
                                    <div className="damageDealtHolder">
                                      <span className="textInDamage">
                                        {participant.totalDamageDealtToChampions.toLocaleString()}
                                      </span>
                                      <div className="damageDealtIndi" style={{ width: `${(participant.totalDamageDealtToChampions/matchMaxDamageArray[index])*100}px` }}></div>
                                    </div>

                                    <div className="damageTakenHolder">
                                      <span className="textInDamage">
                                        {participant.totalDamageTaken.toLocaleString()}
                                      </span>
                                      <div className="damageTakenIndi" style={{ width: `${(participant.totalDamageTaken/matchDamageTaken[index])*100}px` }}></div>          
                                    </div>

                                  </div>
                                </td>

                                <td>
                                  <div className="csHolder Holder">
                                    {participant.neutralMinionsKilled+participant.totalMinionsKilled}
                                  </div>
                                </td>

                                <td>
                                  <div className="itemsHolder">
                                    <img src={`/imagesData/champion/item/${participant.item0}.png`} alt={participant.item0}></img>
                                    <img src={`/imagesData/champion/item/${participant.item1}.png`} alt={participant.item1}></img>
                                    <img src={`/imagesData/champion/item/${participant.item2}.png`} alt={participant.item2}></img>
                                    <img src={`/imagesData/champion/item/${participant.item3}.png`} alt={participant.item3}></img>
                                    <img src={`/imagesData/champion/item/${participant.item4}.png`} alt={participant.item4}></img>
                                    <img src={`/imagesData/champion/item/${participant.item5}.png`} alt={participant.item5}></img>
                                    <img src={`/imagesData/champion/item/${participant.item6}.png`} alt={participant.item6}></img>
                                  </div>
                                </td>   
                              </tr>                        
                            ))}
                          </tbody>
                        </table>

                        <table>
                          <thead>
                            <tr className="botPartTable">
                              <th>Red Team ({match.match.info.teams[1].win === true?<span className='VicCol'>Victory</span>:<span className='DefCol'>Defeat</span>})</th>
                              <th>KDA</th>
                              <th>Damage</th>
                              <th>CS</th>
                              <th>Item</th>
                            </tr>
                          </thead>

                          <tbody className={`${match.match.info.teams[1].win === true?"Victory":"Defeat"}`}>
                            {match.match.info.participants.slice(5,10).map((participant, b) => (
                              <tr className="summonerRowB" key={b}>
                                <td>
                                  <div className="topPart">

                                    <div className="imageHolder">
                                      <img className="championImageLow" src={`https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/${getIdToName(participant.championId)}.png`} alt={getIdToName(participant.championId)} />
                                      <span className="champLevelLow">{participant.champLevel}</span>
                                    </div>

                                    <div>
                                    <div className="middlePartSpellLow">
                                      <img alt={spell(participant.summoner2Id)} src={"/imagesData/champion/spells/" + spell(participant.summoner2Id) + ".png"}></img>
                                    </div>
                                    <div className="middlePartSpellLow">
                                      <img alt={rune(participant.perks.styles[0].selections[0].perk)} src={"/imagesData/champion/runes/" + rune(participant.perks.styles[0].selections[0].perk) + ".png"}></img>
                                    </div> 
                                  </div>
                                
                                  <div>
                                    <div className="middlePartRuneLow">
                                      <img alt={spell(participant.summoner1Id)} src={"/imagesData/champion/spells/" + spell(participant.summoner1Id) + ".png"}></img>
                                    </div>
                                    <div className="middlePartRuneLow">
                                      <img alt={rune(participant.perks.styles[1].style)} src={"/imagesData/champion/runes/" + rune(participant.perks.styles[1].style) + ".png"}></img>
                                    </div>
                                  </div>

                                    <li className="summonerDataLow">
                                      <Link onClick={scrollToTop} to={`/summoner/${barRegion}/${participant.summonerName}`}>{participant.summonerName}</Link>
                                      <span>{participant.summonerLevel} Lvl</span>
                                    </li>

                                  </div>                                  
                                </td>

                                <td>
                                  <div className="kdaHolder Holder">
                                    <span>
                                      {participant.kills}<span className="garygraygary">/</span><span className="deaths">{participant.deaths}</span><span className="garygraygary">/</span>{participant.assists} <span className="garygraygary">|</span> <span className="deaths"> {match.match.info.teams[1].objectives.champion.kills ? (((participant.kills+participant.assists)/match.match.info.teams[1].objectives.champion.kills)*100).toFixed(0): "0"}%</span>
                                    </span>
                                    <span>
                                      {participant.deaths === 0 ? "Perfect KDA" : ((participant.kills+participant.assists)/participant.deaths).toFixed(2) + ":1 KDA"}
                                    </span>
                                  </div>
                                </td>
                            
                                <td>
                                  <div className="damageHolder Holder">

                                    <div className="damageDealtHolder">
                                      <span className="textInDamage">
                                        {participant.totalDamageDealtToChampions.toLocaleString()}
                                      </span>
                                      <div className="damageDealtIndi" style={{ width: `${(participant.totalDamageDealtToChampions/matchMaxDamageArray[index])*100}px` }}></div>
                                    </div>

                                    <div className="damageTakenHolder">
                                      <span className="textInDamage">
                                        {participant.totalDamageTaken.toLocaleString()}
                                      </span>
                                      <div className="damageTakenIndi" style={{ width: `${(participant.totalDamageTaken/matchDamageTaken[index])*100}px` }}></div>
                                    </div>
                              
                                  </div>
                                </td>

                                <td>
                                  <div className="csHolder Holder">
                                    {participant.neutralMinionsKilled+participant.totalMinionsKilled}
                                  </div>
                                </td>
                                
                                <td>
                                  <div className="itemsHolder">
                                    <img src={`/imagesData/champion/item/${participant.item0}.png`} alt={participant.item0}></img>
                                    <img src={`/imagesData/champion/item/${participant.item1}.png`} alt={participant.item1}></img>
                                    <img src={`/imagesData/champion/item/${participant.item2}.png`} alt={participant.item2}></img>
                                    <img src={`/imagesData/champion/item/${participant.item3}.png`} alt={participant.item3}></img>
                                    <img src={`/imagesData/champion/item/${participant.item4}.png`} alt={participant.item4}></img>
                                    <img src={`/imagesData/champion/item/${participant.item5}.png`} alt={participant.item5}></img>
                                    <img src={`/imagesData/champion/item/${participant.item6}.png`} alt={participant.item6}></img>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      
                      <div className="bottomFooterPart">
                        {match.match.metadata.matchId}
                      </div>

                      </div>
{/* TABLE DESKTOP END */}

{/* TABLE MOBILE START */}
                      <div className="infoAboutTeamMobile">
                        <table>
                          <thead>
                            <tr className="topPartTable">
                              <th>Blue Team ({match.match.info.teams[0].win === true?<span className='VicCol'>Victory</span>:<span className='DefCol'>Defeat</span>})</th>
                              <th>KDA</th>
                              <th>Item</th>
                            </tr>
                          </thead>

                          <tbody className={`${match.match.info.teams[0].win === true?"Victory":"Defeat"}`}>
                            {match.match.info.participants.slice(0,5).map((participant, c) => (
                              <tr className="summonerRowT"   key={c}>
                                <td>
                                  <div className="topPart">

                                    <div className="imageHolder">
                                      <img className="championImageLow" src={`https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/${getIdToName(participant.championId)}.png`} alt={getIdToName(participant.championId)}/>
                                      <span className="champLevelLow">{participant.champLevel}</span>
                                    </div>

                                    <div>
                                    <div className="middlePartSpellLow">
                                      <img alt={spell(participant.summoner2Id)} src={"/imagesData/champion/spells/" + spell(participant.summoner2Id) + ".png"}></img>
                                    </div>
                                    <div className="middlePartSpellLow">
                                      <img alt={rune(participant.perks.styles[0].selections[0].perk)} src={"/imagesData/champion/runes/" + rune(participant.perks.styles[0].selections[0].perk) + ".png"}></img>
                                    </div> 
                                  </div>
                                
                                  <div>
                                    <div className="middlePartRuneLow">
                                      <img alt={spell(participant.summoner1Id)} src={"/imagesData/champion/spells/" + spell(participant.summoner1Id) + ".png"}></img>
                                    </div>
                                    <div className="middlePartRuneLow">
                                      <img alt={rune(participant.perks.styles[1].style)} src={"/imagesData/champion/runes/" + rune(participant.perks.styles[1].style) + ".png"}></img>
                                    </div>
                                  </div>

                                    <li className="summonerDataLow">
                                      <Link onClick={scrollToTop} to={`/summoner/${barRegion}/${participant.summonerName}`}>{participant.summonerName}</Link>
                                      <span>{participant.summonerLevel} Lvl</span>
                                    </li>
                              
                                  </div>
                                </td>       
                            
                                <td>
                                  <div className="kdaHolder Holder Mobile">
                                    <span>
                                      {participant.kills}<span className="garygraygary">/</span><span className="deaths">{participant.deaths}</span><span className="garygraygary">/</span>{participant.assists}
                                    </span>
                                    <span>
                                      {participant.deaths === 0 ? "Perfect KDA" : ((participant.kills+participant.assists)/participant.deaths).toFixed(2) + ":1"}
                                    </span>
                                  </div>
                                </td>
                          
                                <td>
                                  <div className="itemsHolder Mobile">
                                    <div className="itemHolderItems Mobile">
                                      <img src={`/imagesData/champion/item/${participant.item0}.png`} alt={participant.item0}></img>
                                      <img src={`/imagesData/champion/item/${participant.item1}.png`} alt={participant.item1}></img>
                                      <img src={`/imagesData/champion/item/${participant.item2}.png`} alt={participant.item2}></img>
                                      <img src={`/imagesData/champion/item/${participant.item3}.png`} alt={participant.item3}></img>
                                      <img src={`/imagesData/champion/item/${participant.item4}.png`} alt={participant.item4}></img>
                                      <img src={`/imagesData/champion/item/${participant.item5}.png`} alt={participant.item5}></img>
                                      <img src={`/imagesData/champion/item/${participant.item6}.png`} alt={participant.item6}></img>
                                    </div>
                                    <div className="gapElements">
                                      <span className="gapElement">
                                        {participant.neutralMinionsKilled+participant.totalMinionsKilled}cs {
                                        (participant.goldEarned >= 1000) ? 
                                        (participant.goldEarned / 1000).toFixed(1) + 'k' : 
                                        participant.goldEarned
                                        }
                                      </span>
                                      <span>
                                          <div className="damageDealtHolder smallFixedStats">
                                          <span className="textInDamage">
                                            {participant.totalDamageDealtToChampions.toLocaleString()}
                                          </span>
                                          <div className="damageDealtIndi smallFixedStatsLOw" style={{ width: `${(participant.totalDamageDealtToChampions/matchMaxDamageArray[index])*100}%` }}></div>
                                        </div>
                                      </span>
                                    </div>
                                  </div>
                                </td>   
                              </tr>                       
                            ))}
                          </tbody> 

                          <thead>
                            <tr className="topPartTable">
                              <th>Red Team ({match.match.info.teams[1].win === true?<span className='VicCol'>Victory</span>:<span className='DefCol'>Defeat</span>})</th>
                              <th>KDA</th>
                              <th>Item</th>
                            </tr>
                          </thead>

                          <tbody className={`${match.match.info.teams[1].win === true?"Victory":"Defeat"}`}>
                            {match.match.info.participants.slice(5,10).map((participant, d) => (
                              <tr className="summonerRowB"  key={d}>
                                <td>
                                  <div className="topPart">

                                    <div className="imageHolder">
                                      <img className="championImageLow" src={`https://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/${getIdToName(participant.championId)}.png`} alt={getIdToName(participant.championId)}/>
                                      <span className="champLevelLow">{participant.champLevel}</span>
                                    </div>
                                    <div>
                                    <div className="middlePartSpellLow">
                                      <img alt={spell(participant.summoner2Id)} src={"/imagesData/champion/spells/" + spell(participant.summoner2Id) + ".png"}></img>
                                    </div>
                                    <div className="middlePartSpellLow">
                                      <img alt={rune(participant.perks.styles[0].selections[0].perk)} src={"/imagesData/champion/runes/" + rune(participant.perks.styles[0].selections[0].perk) + ".png"}></img>
                                    </div> 
                                  </div>
                                
                                  <div>
                                    <div className="middlePartRuneLow">
                                      <img alt={spell(participant.summoner1Id)} src={"/imagesData/champion/spells/" + spell(participant.summoner1Id) + ".png"}></img>
                                    </div>
                                    <div className="middlePartRuneLow">
                                      <img alt={rune(participant.perks.styles[1].style)} src={"/imagesData/champion/runes/" + rune(participant.perks.styles[1].style) + ".png"}></img>
                                    </div>
                                  </div>

                                    <li className="summonerDataLow">
                                      <Link onClick={scrollToTop} to={`/summoner/${barRegion}/${participant.summonerName}`}>{participant.summonerName}</Link>
                                      <span>{participant.summonerLevel} Lvl</span>
                                    </li>
                              
                                  </div>
                                </td>       
                                <td>
                                  <div className="kdaHolder Holder Mobile">
                                    <span>
                                      {participant.kills}<span className="garygraygary">/</span><span className="deaths">{participant.deaths}</span><span className="garygraygary">/</span>{participant.assists}
                                    </span>
                                    <span>
                                      {participant.deaths === 0 ? "Perfect KDA" : ((participant.kills+participant.assists)/participant.deaths).toFixed(2) + ":1"}
                                    </span>
                                  </div>
                                </td>
                                
                                <td>
                                  <div className="itemsHolder Mobile">
                                    <div className="itemHolderItems Mobile">
                                      <img src={`/imagesData/champion/item/${participant.item0}.png`} alt={participant.item0}></img>
                                      <img src={`/imagesData/champion/item/${participant.item1}.png`} alt={participant.item1}></img>
                                      <img src={`/imagesData/champion/item/${participant.item2}.png`} alt={participant.item2}></img>
                                      <img src={`/imagesData/champion/item/${participant.item3}.png`} alt={participant.item3}></img>
                                      <img src={`/imagesData/champion/item/${participant.item4}.png`} alt={participant.item4}></img>
                                      <img src={`/imagesData/champion/item/${participant.item5}.png`} alt={participant.item5}></img>
                                      <img src={`/imagesData/champion/item/${participant.item6}.png`} alt={participant.item6}></img>
                                    </div>
                                    <div className="gapElements">
                                      <span className="gapElement">
                                        {participant.neutralMinionsKilled+participant.totalMinionsKilled}cs {
                                        (participant.goldEarned >= 1000) ? 
                                        (participant.goldEarned / 1000).toFixed(1) + 'k' : 
                                        participant.goldEarned
                                        } 
                                         
                                      </span>
                                      <span>
                                          <div className="damageDealtHolder smallFixedStats">
                                          <span className="textInDamage">
                                            {participant.totalDamageDealtToChampions.toLocaleString()}
                                          </span>
                                          <div className="damageDealtIndi smallFixedStatsLOw" style={{ width: `${(participant.totalDamageDealtToChampions/matchMaxDamageArray[index])*100}%` }}></div>
                                        </div>
                                      </span>
                                    </div>
                                  </div>
                                </td>   
                              </tr>                       
                            ))}
                          </tbody>
                      </table>
                      
                      <div className="bottomFooterPart"></div>
                      </div>
                      </>
                      )}
                      </>
                    )}

{/* TABLE MOBILE END */}
                      
                      {showAdditionalInfoIndex === index && (
                      activeSection === "build" && (
                      <div>
                       <Build summonerInfo={summonerInfo} match={match}/>
                      </div>
                      ))}

                      {showAdditionalInfoIndex === index && (
                        activeSection === "details" && (
                          <Details match={match} summonerInfo={summonerInfo}/>
                      ))}

                  </div>
                ))}

                {numDisplayed < 100 && (
                loading? (       
                <button className="showMore" disabled>
                <ClipLoader
                  color={color}
                  loading={loading}
                  size={10}
                  className="loaderName"
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
                </button>
                ):(
                <button className="showMore" onClick={handleShowMore}>
                  Show More
                </button>
                )
                )}
                

                </div>
              </div>
            ):(
            <div className="noMatch">
              <AiOutlineExclamationCircle/>
              <p>No matches found</p>
            </div>
            )}
      </div>
    </div>
  );
}