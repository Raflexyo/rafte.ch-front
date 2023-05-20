import React, { useState, useEffect } from "react";
import { Routes, Route, useParams} from "react-router-dom";
import "../css/SummonerPage.css";
import SummonerInfo from "./SummonerInfo";
import Compare from "./Compare";
import SummonerMaestry from "./SummonerMaestry";
import SummonerSummary from "./SummonerSummary";
import Footer from "./Footer";
import { hosting } from "../Hosting";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import Live from "../items/Live";

export default function SummonerPage() {
  const { barRegion, summonerName } = useParams();
  const [summonerRank, setSummonerRank] = useState([]);
  const [summonerInfo, setSummonerInfo] = useState([]);
  const [summonerMastery, setSummonerMastery] = useState([]);
  const [summonerTitle, setSummonerTitle] = useState([]);
  const [liveResponse, setLive] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);

    try {
      const summonerInfoData = await axios.get(`${hosting}/summoner/${barRegion}/${summonerName}`);
      setSummonerInfo(summonerInfoData.data.summonerInfo);
      setSummonerRank(summonerInfoData.data.summonerRank);
      setSummonerTitle(summonerInfoData.data.summonerTitle)

      const matches = await axios.get(`${hosting}/summoner/${barRegion}/${summonerName}/matches`);
      setMatches(matches.data.matches);

      const summonerMastery = await axios.get(`${hosting}/summoner/${barRegion}/${summonerName}/maestry`);
      setSummonerMastery(summonerMastery.data);

      const liveResponse = await axios.get(`${hosting}/summoner/${barRegion}/${summonerName}/live`);
      setLive(liveResponse.data);

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, [barRegion, summonerName]);

  const color = "#85417c";

  return (
    <>
      <SummonerInfo summonerTitle={summonerTitle} summonerInfo={summonerInfo} summonerRank={summonerRank} loading={loading}/>

      {loading ? (
        <div className="loadingData"><ClipLoader color={color} loading={loading} size={60} className="loader" aria-label="Loading Spinner" data-testid="loader"/></div>
         ) : (
    <Routes>
      <>
        <Route path={`/`} element={<SummonerSummary  setMatches={setMatches} summonerName={summonerName} summonerInfo={summonerInfo} matches={matches} summonerRank={summonerRank} barRegion={barRegion}/>}/>
        <Route path={`/maestry`} element={<SummonerMaestry summonerMastery={summonerMastery} />}/>            
        <Route path={`/compare`} element={<Compare summonerInfo={summonerInfo} summonerRank={summonerRank} matches={matches}/>}/>
        <Route path={`/live`} element={<Live liveResponse={liveResponse} summonerInfo={summonerInfo} barRegion={barRegion}/>}/>
      </>
    </Routes>
          )}
        <Footer />
    </>
  );
}