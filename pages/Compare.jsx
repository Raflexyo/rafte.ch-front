import React, { useState, useEffect, useRef} from "react";
import "../css/items/Compare.css"
import {HiMagnifyingGlass} from "react-icons/hi2";
import eune from "../icons/EUNE.svg";
import euw from "../icons/EUW.svg";
import na from "../icons/NA.svg";
import oce from "../icons/OCE.svg";
import kr from "../icons/KR.svg";
import jp from "../icons/JP.svg";
import { RiArrowDropDownFill, RiArrowDropUpFill } from "react-icons/ri";
import axios from "axios";
import { hosting } from "../Hosting";
import { Link } from "react-router-dom";
import { posToReal } from "../functions/Map&SR";

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Compare({summonerInfo, summonerRank, matches}){
  const [region, setRegion] = useState("eune");
  const [showRegions, setShowRegions] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [summonerName, setSummonerName] = useState("");
  const [compMatches, setCompMatches] = useState([]);
  const [compInfo, setCompInfo] = useState([]);
  const [compRank, setCompRank] = useState([]);
  const inputRef = useRef(null);
  const [search, setShowSearch] = useState(false);

  function handleInputKeyDown(event) {
    if (event.key === 'Enter') {
      document.body.classList.remove('no-scroll');
      handleGoClick();
    } else{
      return null;
    }
  }

  const toggleSearch = () => {
    document.body.classList.add('no-scroll');
    setShowSearch((prev) => !prev);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const toggleRegions = () => {
    setShowRegions((prev) => !prev);
  };

  const handleRegionClick = (region) => {
    if (region === "eune") {
      setSelectedRegion("EUNE");
      setRegion(region);
    } else if (region === "euw") {
      setSelectedRegion("EUW");
      setRegion(region);
    } else if (region === "na") {
      setSelectedRegion("NA");
      setRegion(region);
    } else if (region === "oce") {
      setSelectedRegion("OCE");
      setRegion(region);
    } else if (region === "kr") {
      setSelectedRegion("KR");
      setRegion(region);
    } else if (region === "jp") {
      setSelectedRegion("JP");
      setRegion(region);
    } else {
      setSelectedRegion(region);
    }
    setShowRegions(false);
  };

  const getRegionLabel = () => {
    if (selectedRegion === "EUNE") {
      return "EUNE";
    } else if (selectedRegion === "EUW") {
      return "EUW";
    } else if (selectedRegion === "NA") {
      return "NA";
    } else if (selectedRegion === "OCE") {
    return "OCE";
    } else if (selectedRegion === "KR") {
    return "KR";
  } else if (selectedRegion === "JP") {
    return "JP";
  }
    return "EUNE";

  }
  
  let barRegion;
  switch (region) {
    case "Europe Nordic & East":
      barRegion = "eune";
      break;
    case "Europe West":
      barRegion = "euw";
      break;
    case "North America":
      barRegion = "na";
      break;
    case "Oceania":
      barRegion = "oce";
      break;
    case "Korea":
      barRegion = "kr";
      break;
    case "Japan":
      barRegion = "jp";
      break;
    default:
      barRegion = region;
      break;
  }
  

  const handleGoClick = async () => {
    setShowSearch(false);
    document.body.classList.remove('no-scroll');
    try {
      const summonerInfoData = await axios.get(`${hosting}/summoner/${barRegion}/${summonerName}`);
      setCompInfo(summonerInfoData.data.summonerInfo);
      setCompRank(summonerInfoData.data.summonerRank);
      const summRanked = await axios.get(`${hosting}/summoner/${barRegion}/${summonerName}/matches`);
      setCompMatches(summRanked.data.matches);
      setSummonerName("");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.log(error.response.data.error);
      } else {
        console.log(error);
      }
    }
  };
  
  
  const handleClickOutside = (event) => {
    const element = document.querySelector(".searchCompare");
    if (!element?.contains(event.target)) {
      setShowSearch(false);
      document.body.classList.remove('no-scroll');
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


const [userAveragedArray, setUserAveragedArray] = useState([]);
const [comparisonAveragedArray, setComparisonAveragedArray] = useState([]);
const [position, setPosition] = useState([]);
const [positionComp, setPositionComp] = useState([]);

useEffect(() => {
  const sumRankInf = [];
  const positionCount = {};
  matches?.forEach((match) => {
    const participant = match.match.info.participants.find(p => p.puuid === summonerInfo.puuid);
    if (participant) {
      const kills = parseInt(participant.kills);
      const assists = parseInt(participant.assists);
      const deaths = parseInt(participant.deaths);
      const wards = parseInt(participant.detectorWardsPlaced);
      const gold = parseInt(participant.goldEarned);
      const cs = parseInt(participant.totalMinionsKilled);
      const dmgd = parseInt(participant.totalDamageDealtToChampions);
      const dmgt = parseInt(participant.totalDamageTaken);
      let kda = deaths !== 0 ? (kills + assists) / deaths : (kills + assists);
      const win = participant.win;
      let wr = win * 100;
      const time = match.match.info.gameDuration;
      const timeAll = (time/60).toFixed(0);
      let dmgM = parseInt(dmgd/timeAll);
      let dmgD = parseInt(dmgd/deaths);
      let dmgT = parseInt(dmgt/deaths);
      let csM = parseInt(cs/timeAll);
      let goldM = parseInt(gold/timeAll);

      let killsM = parseFloat(kills/timeAll);
      let deathsM = parseFloat(deaths/timeAll);
      let AssistsM = parseFloat(assists/timeAll);

      const position = participant.individualPosition; 
      


      const array = [
        wr, kda,cs,gold, kills,killsM, deaths,deathsM, assists,AssistsM, dmgd, dmgt,dmgM, dmgD, dmgT,wards, csM, goldM
      ];

      sumRankInf.push(array);

      if (positionCount[position]) {
        positionCount[position]++;
      } else {
        positionCount[position] = 1;
      }
    }
  });

  let mostPlayedPosition;
  let maxCount = 0;

  for (const position in positionCount) {
    if (positionCount[position] > maxCount) {
      mostPlayedPosition = position;
      maxCount = positionCount[position];
    }
  }

  setPosition(mostPlayedPosition);


  const calculateSumAndAverage = (array, toFixedValues) => {
    if (!array || array.length === 0) {
      return [];
    }
  
    const sumArray = Array.from(array[0], (_, index) =>
      array.reduce((sum, currentValue) => {
        const value = parseFloat(currentValue[index]);
        return isNaN(value) ? sum : sum + value;
      }, 0)
    );
    const averagedArray = sumArray.map((value, index) => {
      const toFixedValue = toFixedValues[index];
      const averagedValue = value / array.length;
      return parseFloat(averagedValue.toFixed(toFixedValue));
    });
    return averagedArray;
  };

  const toFixedValues = [0, 2, 1, 1, 1, 2, 1, 2, 1, 2, 0, 0, 0, 0, 0 ,2 ,2, 1];
  const userAveragedArray = calculateSumAndAverage(sumRankInf, toFixedValues);
  setUserAveragedArray(userAveragedArray);

}, [matches, summonerInfo.puuid]);


useEffect(() => {
  const comRankInf = [];
  const positionCount = {};
  compMatches?.forEach((match) => {
    const participant = match.match.info.participants.find(p => p.puuid === compInfo.puuid);
    if (participant) {
      const kills = parseInt(participant.kills);
      const assists = parseInt(participant.assists);
      const deaths = parseInt(participant.deaths);
      const wards = parseInt(participant.detectorWardsPlaced);
      const gold = parseInt(participant.goldEarned);
      const cs = parseInt(participant.totalMinionsKilled);
      const dmgd = parseInt(participant.totalDamageDealtToChampions);
      const dmgt = parseInt(participant.totalDamageTaken);
      let kda = deaths !== 0 ? (kills + assists) / deaths : (kills + assists);
      const win = participant.win;
      let wr = win * 100;
      const time = match.match.info.gameDuration;
      const timeAll = (time/60).toFixed(0);
      let dmgM = parseInt(dmgd/timeAll);
      let dmgD = parseInt(dmgd/deaths);
      let dmgT = parseInt(dmgt/deaths);
      let csM = parseInt(cs/timeAll);
      let goldM = parseInt(gold/timeAll);

      let killsM = parseFloat(kills/timeAll);
      let deathsM = parseFloat(deaths/timeAll);
      let AssistsM = parseFloat(assists/timeAll);

      const position = participant.individualPosition; 

      const array = [
        wr, kda,cs,gold, kills,killsM, deaths,deathsM, assists,AssistsM, dmgd, dmgt,dmgM, dmgD, dmgT,wards, csM, goldM
      ];

      comRankInf.push(array);

      if (positionCount[position]) {
        positionCount[position]++;
      } else {
        positionCount[position] = 1;
      }
    }
  });

  let mostPlayedPosition;
  let maxCount = 0;

  for (const position in positionCount) {
    if (positionCount[position] > maxCount) {
      mostPlayedPosition = position;
      maxCount = positionCount[position];
    }
  }

  setPositionComp(mostPlayedPosition);


  const calculateSumAndAverage = (array, toFixedValues) => {
    if (!array || array.length === 0) {
      return [];
    }
  
    const sumArray = Array.from(array[0], (_, index) =>
      array.reduce((sum, currentValue) => {
        const value = parseFloat(currentValue[index]);
        return isNaN(value) ? sum : sum + value;
      }, 0)
    );
    const averagedArray = sumArray.map((value, index) => {
      const toFixedValue = toFixedValues[index];
      const averagedValue = value / array.length;
      return parseFloat(averagedValue.toFixed(toFixedValue));
    });
    return averagedArray;
  };

  const toFixedValues = [0, 2, 1, 1, 1, 2, 1, 2, 1, 2, 0, 0, 0, 0, 0 ,2 ,2, 1];
  const comparisonAveragedArray = calculateSumAndAverage(comRankInf, toFixedValues);
  setComparisonAveragedArray(comparisonAveragedArray);


}, [compMatches, compInfo.puuid]);

const names = ["WR","KDA","CS", "Gold","Kills","Kills/Min", "Deaths","Deaths/Min", "Assists","Assists/Min", "Damage Dealt", "Damage Taken", "Damage/Min", "Damage/Death", "DamageT/Death","Wards", "CS/Min", "Gold/Min"]

return(
  <>
    {search ? (
  <div className="bogScreenUwU">
  <div className="searchCompare">

    <button className="region" onClick={toggleRegions}>
      {getRegionLabel()}
      {showRegions ? <RiArrowDropUpFill /> : <RiArrowDropDownFill />}
    </button>

    <input type="text" ref={inputRef} className="inputFieldCompare" value={summonerName} placeholder= "Name..."
           onChange={(e) => setSummonerName(e.target.value)} onKeyDown={handleInputKeyDown}/>

    <button className="submit" onClick={handleGoClick}>GO</button>

      {showRegions && (
        <div className="regionPicker">
      
      <button className="regionButton" onClick={() => handleRegionClick("eune")}>
        <img src={eune} alt="eune"></img>
        <span className="buttonText">Europe Nordic & East</span>
      </button>

      <button className="regionButton" onClick={() => handleRegionClick("euw")}>
        <img src={euw} alt="euw"></img>
        <span className="buttonText">Europe West</span>
      </button>

      <button className="regionButton" onClick={() => handleRegionClick("na")}>
        <img src={na} alt="na"></img>
        <span className="buttonText">North America</span>
      </button>

      <button className="regionButton" onClick={() => handleRegionClick("oce")}>
        <img src={oce} alt="oce"></img>
        <span className="buttonText">Oceania</span>
      </button>

      <button className="regionButton" onClick={() => handleRegionClick("kr")}>
        <img src={kr} alt="kr"></img>
        <span className="buttonText">Korea</span>
      </button>

      <button className="regionButton" onClick={() => handleRegionClick("jp")}>
        <img src={jp} alt="jp"></img>
        <span className="buttonText">Japan</span>
      </button>


    </div>
  )}
  </div>
  </div>
  ):(null)}
  <div className="CompareWrapper">
    <div className="Compare">
    <div className="holdThoseItemsPleaseUwU">
      <div className="leftCompare">

          <div className="compHoldixes">
            <img className='summonerImg fixComp' src={`https://ddragon.leagueoflegends.com/cdn/13.10.1/img/profileicon/${summonerInfo.profileIconId}.png`} alt={summonerInfo.profileIconId}/>
            <span className='summonerLevel CompFix'>{summonerInfo?.summonerLevel}</span>
            </div>

            <span className="CompName">{summonerInfo?.name}</span>
            {summonerRank[0]?.tier === "GRANDMASTER" || summonerRank[0]?.tier === "CHALLENGER" || summonerRank[0]?.tier === "MASTER" 
            ? <span className="RankComp">{summonerRank[0]?.tier} {summonerRank[0]?.leaguePoints} LP</span>
            : <span className="RankComp">{summonerRank[0]?.tier} {summonerRank[0]?.rank} {summonerRank[0]?.leaguePoints} LP</span>
            }
          <span className="favPos">{posToReal(position)}</span>
      </div>
      <div className="rightCompare">
        <div className="gapElementCompare">
        {compInfo?.profileIconId ? (
          <div className="compHoldixes">
            <img className='summonerImg fixComp' src={`https://ddragon.leagueoflegends.com/cdn/13.10.1/img/profileicon/${compInfo.profileIconId}.png`} alt={compInfo.profileIconId}/>
            <span className='summonerLevel CompFix'>{compInfo?.summonerLevel}</span>
            </div>
        ):(<div className="blankSpaceHolder"><Skeleton height={100} width={100} baseColor="#1c1c1f" highlightColor="#9E9EB1" duration={1.75}/> </div>)}
            <div className="flexdlex">
            {compInfo?.name ? (
              <Link to={`/summoner/${barRegion}/${compInfo.name}`} className="CompName lefcior">{compInfo?.name}</Link>
          ):(null )}
          <button onClick={toggleSearch} className="buttonCompare"><HiMagnifyingGlass className="iconCompare"/></button>
          </div> 
          {compRank[0] == null ? null : (
            compRank[0]?.tier === "GRANDMASTER" || compRank[0]?.tier === "CHALLENGER" || compRank[0]?.tier === "MASTER" 
              ? <span className="RankComp">{compRank[0]?.tier} {compRank[0]?.leaguePoints} LP</span>
              : <span className="RankComp">{compRank[0]?.tier} {compRank[0]?.rank} {compRank[0]?.leaguePoints} LP</span>
          )}
          <span className="favPos">{positionComp ? (posToReal(positionComp)):(null)}</span>
        </div>
        </div>
</div>
      <div className="middleCompare">
      <span className="VS">VS</span>
        {names.map((name, index) => {
          const userValue = userAveragedArray[index];
          const compValue = comparisonAveragedArray[index];
          const isUserHigher = userValue > compValue;
          const isCompHigher = userValue < compValue;

          return (
            <React.Fragment key={index}>
              <div className="HolderOFCom">
                <span className={`valueOfCOmL ${isUserHigher ? "high" : "low"}`}>
                {userValue == null ? null : userValue }   
                </span>
                <span className="smallTextComp">{name}</span>
                <span className={`valueOfCOmR ${isCompHigher ? "high" : "low"}`}>
                {compValue == null ? <Skeleton width={125} baseColor="#1c1c1f" highlightColor="#9E9EB1" duration={1.75}/> : compValue } 
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  </div>
  </>
);

}