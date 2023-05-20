import React, { useState, useEffect } from "react";
import "../css/Navindex.css";
import eune from "../icons/EUNE.svg";
import euw from "../icons/EUW.svg";
import na from "../icons/NA.svg";
import oce from "../icons/OCE.svg";
import kr from "../icons/KR.svg";
import jp from "../icons/JP.svg";
import { RiArrowDropDownFill, RiArrowDropUpFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CgClose } from "react-icons/cg";
import { hosting } from "../Hosting";

export default function Navindex() {
  const [summonerName, setSummonerName] = useState("");
  const [region, setRegion] = useState("eune");
  const [showRegions, setShowRegions] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showFav, setShowFav] = useState(false);

  const [recentSearches, setRecentSearches] = useState([]);

  const [isInputExpanded, setIsInputExpanded] = useState(false);

  const navigate = useNavigate();


  function handleInputKeyDown(event) {
    if (event.key === 'Enter') {
      setShowFav(false);
      handleGoClick();
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
  
  useEffect(() => {
    const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(searches);
  }, []);
  
  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);


  const [showFavorites, setShowFavorites] = useState(false);
  const [showRecent, setShowRecent] = useState(true);

  const [favoriteSummoners, setFavoriteSummoners] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem("favoriteSummoners");
    if (storedData) {
      setFavoriteSummoners(JSON.parse(storedData));
    }
  }, []);

  const handleRemoveSearchTwo = (idToRemove) => {
    setFavoriteSummoners((prevFavoriteSummoners) => {
      const updatedFavorites = prevFavoriteSummoners.filter((summoner) => summoner.id !== idToRemove);
      localStorage.setItem("favoriteSummoners", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const handleGoClick = async () => {
    navigate(`/summoner/${barRegion}/${summonerName}`);
    try {
      await axios.get(
        `${hosting}/summoner/${barRegion}/${summonerName}`
      );
      setSummonerName("");
      const newSearch = `${region}/${summonerName}`;
      setRecentSearches((prevSearches) => {
        const index = prevSearches.indexOf(newSearch);
        if (index !== -1) {
          return [
            newSearch,
            ...prevSearches.slice(0, index),
            ...prevSearches.slice(index + 1),
          ];
        } else {
          return [newSearch, ...prevSearches.slice(0, 6)];
        }
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        navigate(`/summoner/not-found`);
      } else {
        console.log(error);
      }
    }
  };

  const handleRemoveSearch = (searchToRemove) => {
    setRecentSearches(prevSearches =>
      prevSearches.filter(search => search !== searchToRemove)
    );
  };
  
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);
  
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

  const handleInputClick = () => {
    setIsInputExpanded(true);
    setSummonerName(summonerName);
    setShowFav(true);
  };

  const handleInputBlur = () => {
    if (summonerName.trim() === "") {
      setIsInputExpanded(false);
    }
  };

  const handleClickOutside = (event) => {
    const element = document.querySelector(".summonerNameFav");
    if (!element?.contains(event.target)) {
      setShowFav(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutsideReg = (event) => {
    const element = document.querySelector(".regionPicker");
    if (!element?.contains(event.target)) {
      setShowRegions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideReg);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideReg);
    };
  }, []);

  const [selectedButton, setSelectedButton] = useState("recent");

  const handleClick = (button) => {
    setSelectedButton(button);
  };

  return (
    <div className="navIndex">
      <div className="navIndexMain">
    <div className="navigationItems">
      <Link className="navItemsHov" to={"/champions"}>Champions</Link>
      <Link className="navItemsHov" to={"/leaderboard"}>Leaderboard</Link>
      <Link className="navItemsHov" to={"/live"}>Live Games</Link>
    </div>
      <div className="inputs">
      <button className="submit" onClick={handleGoClick}>GO</button>
          <input
              type="text"
              className={isInputExpanded ? "expanded" : ""}
              onClick={handleInputClick}
              onBlur={handleInputBlur}
              value={summonerName}
              placeholder={isInputExpanded ? "Summoner name..." : ""}
              onChange={(e) => setSummonerName(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            {showFav && (
              <div className="summonerNameFav">

                <div className="favNavigationButtons">
                <button onClick={() => {
                  setShowFavorites(false);
                  setShowRecent(true);
                  setShowFav(true);
                  handleClick("recent");
                }} className={selectedButton === "recent" ? "recentButton active" : "recentButton"}>Recent</button>
                <button onClick={() => {
                  setShowFavorites(true);
                  setShowRecent(false);
                  setShowFav(true);
                  handleClick("favorite");
                }} className={selectedButton === "favorite" ? "favButton active" : "favButton"}>Favorites</button>
                </div>

                {showRecent && (
                <div className="recent">
                  {recentSearches.map((search) => {
                    const [region, summonerName] = search.split("/");
                    const regionUp = region.toUpperCase();
                    return (
                      <div className="wrapLinks" key={search}>
                        <Link
                          key={search}
                          to={`/summoner/${region}/${summonerName}`}
                          onClick={() => {
                            setShowFav(false);
                            setIsInputExpanded(false);
                          }}
                          className="favNavigation"
                        >
                          <span className="favRegion">{regionUp}</span>
                          <span className="favName">{summonerName}</span>
                        </Link>
                        <CgClose
                          className="removeButton"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleRemoveSearch(search);
                          }}
                        />
                      </div>
                    );
                  })}
                  </div>
                  )}

                  {showFavorites && (
                    <div className="favs">
                      {favoriteSummoners.map((summoner) => {
                        const region = summoner.region;
                        const regionDis = region.toUpperCase();
                        const name = summoner.name;
                        return (
                          <div className="wrapLinks" key={summoner.id}>
                            <Link
                              key={summoner.id}
                              to={`/summoner/${region}/${name}`}
                              onClick={() => {
                                setShowFav(false);
                                setIsInputExpanded(false);
                              }}
                              className="favNavigation"
                            >
                              <span className="favRegion">{regionDis}</span>
                              <span className="favName">{name}</span>
                            </Link>
                            <CgClose
                              className="removeButton"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleRemoveSearchTwo(summoner.id);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
            )}
            <button className="region" onClick={toggleRegions}>
          {getRegionLabel()}
          {showRegions ? <RiArrowDropUpFill /> : <RiArrowDropDownFill />}
        </button>
        {showRegions && (
            <div className="regionPicker">
              
              <button
                className="regionButton"
                onClick={() => handleRegionClick("eune")}
              >
                <img src={eune} alt="eune"></img>
                <span className="buttonText">Europe Nordic & East</span>
              </button>

              <button
                className="regionButton"
                onClick={() => handleRegionClick("euw")}
              >
                <img src={euw} alt="euw"></img>
                <span className="buttonText">Europe West</span>
              </button>

              <button
                className="regionButton"
                onClick={() => handleRegionClick("na")}
              >
                <img src={na} alt="na"></img>
                <span className="buttonText">North America</span>
              </button>

              <button
                className="regionButton"
                onClick={() => handleRegionClick("oce")}
              >
                <img src={oce} alt="oce"></img>
                <span className="buttonText">Oceania</span>
              </button>

              <button
                className="regionButton"
                onClick={() => handleRegionClick("kr")}
              >
                <img src={kr} alt="kr"></img>
                <span className="buttonText">Korea</span>
              </button>

              <button
                className="regionButton"
                onClick={() => handleRegionClick("jp")}
              >
                <img src={jp} alt="jp"></img>
                <span className="buttonText">Japan</span>
              </button>


            </div>
          )}
            </div>
      </div>
    </div>
  );
}