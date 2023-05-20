import React from "react";
import "../css/SummonerMaestry.css";
import {getIdToNameTwo, getIdToName} from "../functions/ChampionsID";

export default function SummonerMaestry({ summonerMastery }) {

    const summonerMa = [];

    summonerMastery[0].map((champion) => {
      const champId = champion.championId;
      const champPts = champion.championPoints;
      const champLvl = champion.championLevel;

      const array = [champLvl, champPts, champId];

      summonerMa.push({
        key: summonerMa.length,
        values: array,
      });
      return null;
    });


  return (
    <div className="SummonerChampionsWrapper">
      <div className="SummonerChampions">
        <div className="banners">
          {summonerMa.map((champ, index) => (
            <div className="bannersPos disabled" key={index}>
              <img className="champImg" src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${getIdToName(champ.values[2])}_0.jpg`} alt={getIdToName(champ.values[2])}/>
              <div className="desc">
                <span className="champName">{getIdToNameTwo(champ.values[2])}</span>
                <div className="sumMPHolder">
                  <img className="MSimg" src={`/imagesData/maestry/${champ.values[0]}.png`} alt={champ.values[0]}/>
                  <span className="sumMP">{champ.values[1].toLocaleString()} MP</span>
                </div>              
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}