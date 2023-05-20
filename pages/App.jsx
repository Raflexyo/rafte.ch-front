import React, {useState} from "react";
import Champions from "../view/Champions";
import MainBody from "./MainBody";
import SummonerPage from "./SummonerPage";
import NotFound from "./NotFound";
import Navbar from '../pages/Navbar';
import Navindex from '../pages/NavIndex';
import PrivPol from "./PrivPol";
import Faq from "./Faq";
import { Routes, Route } from "react-router-dom";
import Socials from "../items/Socials";
import Leaderboard from "../items/Leaderboard";
import LiveGames from "../items/LiveGames";

export default function App(){
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  return(
    <>
      <Navbar isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme}/>
      <Navindex/>

      <Routes>
      <Route path="/" element={<MainBody isDarkTheme={isDarkTheme}/>}/>
      <Route path="/champions" element={<Champions/>}/>
      <Route path="/summoner/:barRegion/:summonerName/*" element={<SummonerPage/>} />
      <Route path="/summoner/not-found" element={<NotFound/>}/>
      <Route path="/privacy-policy" element={<PrivPol/>}/>
      <Route path="/faq" element={<Faq/>}/>
      <Route path="/socials" element={<Socials/>}/>
      <Route path="/leaderboard" element={<Leaderboard/>}/>
      <Route path="/live" element={<LiveGames/>}/>
      </Routes>
      </>
  );


}