import React, { useState, useEffect } from "react";
import "../css/MainBody.css";
import eune from "../icons/EUNE.svg";
import euw from "../icons/EUW.svg";
import na from "../icons/NA.svg";
import oce from "../icons/OCE.svg";
import kr from "../icons/KR.svg";
import jp from "../icons/JP.svg";
import { RiArrowDropDownFill, RiArrowDropUpFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { hosting } from "../Hosting";
import Footer from "./Footer";
import Cookies from "../items/Cookies";

export default function MainBody(props) {
  const { isDarkTheme } = props;
  const [summonerName, setSummonerName] = useState("");
  const [region, setRegion] = useState("");
  const [loadData ,setLoadData] = useState([]);
  const [showRegions, setShowRegions] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("Region");
  const navigate = useNavigate();


  function handleInputKeyDown(event) {
    if (event.key === 'Enter') {
      handleGoClick();
    }
  }

  const toggleRegions = () => {
    setShowRegions((prev) => !prev);
  };

  const handleRegionClick = (region) => {
    if (region === "Europe Nordic & East") {
      setSelectedRegion("EUNE");
      setRegion(region);
    } else if (region === "Europe West") {
      setSelectedRegion("EUW");
      setRegion(region);
    } else if (region === "North America") {
      setSelectedRegion("NA");
      setRegion(region);
    } else if (region === "Oceania") {
      setSelectedRegion("OCE");
      setRegion(region);
    } else if (region === "Korea") {
      setSelectedRegion("KR");
      setRegion(region);
    } else if (region === "Japan") {
      setSelectedRegion("JP");
      setRegion(region);
    } else {
      setSelectedRegion(region);
    }
    setShowRegions(false);
  };

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
    try {
      await axios.get(`${hosting}/summoner/${barRegion}/${summonerName}`);
      setSummonerName("");
      navigate(`/summoner/${barRegion}/${summonerName}`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        navigate(`/summoner/not-found`);
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${hosting}/main`);
        setLoadData(response.data);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          navigate(`/`);
        } else {
          console.log(error);
        }
      }
    };
  
    fetchData();
  }, []);

  const handleClickOutside = (event) => {
    const element = document.querySelector(".regionsLabel");
    if (!element?.contains(event.target)) {
      setShowRegions(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }


  return (
    <>
    <Cookies/>
    <div className="body">
      <div className="bodyWrapper">
        <div className="mainContentBody">
              {isDarkTheme ? <img alt={"darkTheme"} className="bodyLogo" src={`/imagesData/BGs/DARK.png`}></img> : <img alt={"lightTheme"} className="bodyLogo" src={`/imagesData/BGs/LIGHT.png`}></img>} 
          <div className="inputBody">
            <div className="inputLabel labelRegion">
              <button
                className="regionPickLabel"
                onClick={toggleRegions}
              >
                <span className="regionName">{selectedRegion}</span>
                {showRegions ? <RiArrowDropUpFill /> : <RiArrowDropDownFill />}
              </button>
              {showRegions && (
                <div className="regionsLabel">
                  <button
                    className="regionsLabelButton"
                    onClick={() => handleRegionClick("Europe Nordic & East")}
                  >
                    <img
                      src={eune}
                      alt="eune"
                    ></img>
                    <span className="labelButtonText">
                      Europe Nordic & East
                    </span>
                  </button>
                  <button
                    className="regionsLabelButton"
                    onClick={() => handleRegionClick("Europe West")}
                  >
                    <img
                      src={euw}
                      alt="euw"
                    ></img>
                    <span className="labelButtonText">Europe West</span>
                  </button>
                  <button
                    className="regionsLabelButton"
                    onClick={() => handleRegionClick("North America")}
                  >
                    <img
                      src={na}
                      alt="na"
                    ></img>
                    <span className="labelButtonText">North America</span>
                  </button>
                  <button
                    className="regionsLabelButton"
                    onClick={() => handleRegionClick("Oceania")}
                  >
                    <img
                      src={oce}
                      alt="oce"
                    ></img>
                    <span className="labelButtonText">Oceania</span>
                  </button>
                  <button
                    className="regionsLabelButton"
                    onClick={() => handleRegionClick("Korea")}
                  >
                    <img
                      src={kr}
                      alt="kr"
                    ></img>
                    <span className="labelButtonText">Korea</span>
                  </button>
                  <button
                    className="regionsLabelButton"
                    onClick={() => handleRegionClick("Japan")}
                  >
                    <img
                      src={jp}
                      alt="jp"
                    ></img>
                    <span className="labelButtonText">Japan</span>
                  </button>
                </div>
              )}
            </div>
            <div className="inputLabel labelInput">
              <input
                type="text"
                placeholder="Summoner name..."
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                onKeyDown={handleInputKeyDown}
              />
            </div>
            <button
              onClick={handleGoClick}
              className="labelButton"
            >
              GO
            </button>
          </div>
            <div className="WorthCechingWrapper">
                <div className="WorthCeching">
                  {loadData.map((user)=>{
                    return(
                      <Link onClick={scrollToTop} key={user[0].name} className="besesesese" to={`/summoner/eune/${user[0].name}`}>
                      <div className="idkHowToNameTHis">
                      <span className="sdaffasdsfdsfd"></span>
                      <div className='summonerIcon MainFixfix'>
                      <img
                        className='summonerImg MainFix'
                        src={`https://ddragon.leagueoflegends.com/cdn/13.10.1/img/profileicon/${user[0].profileIconId}.png`}
                        alt={user[0].proflileIconId}
                      />
                      <span className='summonerLevel mainFixX'>{user[0].summonerLevel}</span>
                    </div>
                        <span className="nameFavDoe">{user[0].name}</span>
                        {user[1][0]?.tier == null ? (<span className="rankrankrankrank">UNRANKED</span>) : (
                          user[1][0]?.tier === "GRANDMASTER" || user[1][0]?.tier === "CHALLENGER" || user[1][0]?.tier === "MASTER"
                            ? <span className="rankrankrankrank">{user[1][0]?.tier}</span>
                            : <span className="rankrankrankrank">{user[1][0]?.tier} {user[1][0]?.rank}</span>
                        )}
                      </div>
                      </Link>
                    )
                  })}
                </div>
            </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}