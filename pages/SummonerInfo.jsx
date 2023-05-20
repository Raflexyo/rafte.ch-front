import { useEffect, useState } from 'react';
import '../css/SummonerInfo.css';
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import {MdContentCopy} from 'react-icons/md';
import {BsCheck} from "react-icons/bs"
import { title } from '../functions/Titles';

export default function SummonerInfo({ summonerInfo, summonerRank, loading, summonerTitle }) {
  const { barRegion, summonerName } = useParams();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  
  const [activeButton, setActiveButton] = useState();

  useEffect(() => {
    const path = location.pathname;
    if (path.endsWith("/maestry")) {
      setActiveButton('maestry');
    } else if (path.endsWith("/compare")) {
      setActiveButton('compare');
    } else if (path.endsWith("/live")) {
      setActiveButton('live');
    } else {
      setActiveButton('summary');
    }
  }, [location.pathname]);

  
const storedFavorites = localStorage.getItem('favoriteSummoners');
const initialFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];

const [favoriteSummoners, setFavoriteSummoners] = useState(initialFavorites);
const [isFavorited, setIsFavorited] = useState(false);

useEffect(() => {
  const favoriteSummonersData = localStorage.getItem("favoriteSummoners");
  if (favoriteSummonersData) {
    const favoriteSummoners = JSON.parse(favoriteSummonersData);
    const isSummonerFavorited = favoriteSummoners.some(
      (summoner) => summoner.region === barRegion && summoner.name === summonerName
    );
    setIsFavorited(isSummonerFavorited);
  } else {
    setIsFavorited(false);
  }
}, [barRegion, summonerName, favoriteSummoners]);

const handleToggleFavorite = () => {
  const index = favoriteSummoners.findIndex(
    (summoner) => summoner.region === barRegion && summoner.name === summonerName
  );
  const newFavorites = [...favoriteSummoners];
  let nextIndex = newFavorites.length;

  if (index === -1) {
    const newSummoner = {
      id: nextIndex,
      region: barRegion,
      name: summonerName,
    };
    newFavorites.push(newSummoner);
    setIsFavorited(true);
  } else {
    newFavorites.splice(index, 1);
    setIsFavorited(false);
  }

  newFavorites.forEach((summoner, i) => {
    summoner.id = i;
  });

  setFavoriteSummoners(newFavorites);
  localStorage.setItem("favoriteSummoners", JSON.stringify(newFavorites));
};

  if (!summonerInfo || !summonerRank) {
    return <div>No data available</div>;
  }

  const name = summonerInfo.name;
  const level = summonerInfo.summonerLevel;
  const color = "#85417c";

  const copyToClipboard = () => {
    const link = window.location.href;
    const message = 'Check my League stats!\n\n';
    const siteURL = message + link;
  
    navigator.clipboard
      .writeText(siteURL)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      })
      .catch((error) => {
        console.error('Failed to copy:', error);
      });
  };

  return (
    <div className="summonerInfoMainWrapper">
      <div className='summonerInfoWrapper'>
        <div className='summonerInfo'> 
          <div className='summonerIcon'>
            {(loading ?(
              <div className='loaderTOP'>
              <ClipLoader
                color={color}
                loading={loading}
                size={60}
                className="loader"
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              </div>
            ):(
              <>
            <img
              className='summonerImg'
              src={`https://ddragon.leagueoflegends.com/cdn/13.10.1/img/profileicon/${summonerInfo.profileIconId}.png`}
              alt={summonerInfo.profileIconId}
            />
            <span className='summonerLevel'>{level}</span>
            </>
            ))}
          </div>
          <div className='summonerData'>
          
            <div className='summonerName'>
            {loading ?(
              <ClipLoader
                color={color}
                loading={loading}
                size={10}
                className="loaderName"
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ):(
              <>
              <h1>{name}</h1>
              </>
            )}
            </div>
            {loading?(null):(
            <span className='summTittle'>{title(summonerTitle?.preferences?.title)}</span>
            )}
            <div className='summonerDivision'>

              {loading ? (
                null
              ): (
                <div className='imnotevencounting'>
                  <button className={isFavorited ? "favoritedButton" : "unfavoritedButton"} onClick={handleToggleFavorite}>
                    {isFavorited ? (
                    <AiFillStar/>
                    ):(
                    <AiOutlineStar/>
                    )}
                  </button>

                  <div className="holdThisPLEase">
                    <button className="shareProfile" onClick={copyToClipboard}>
                      {copied ? <BsCheck /> : <MdContentCopy />}
                    </button>
                  </div>

                </div>
              )}
            </div>

            {loading ? (null) :(
              <>
            <div className='summonerUpdate'>
              <button className='summonerUpdateButton' onClick={() => window.location.reload()}>Update</button>
            </div>
            </>
            )}
          </div>
        </div>
      </div>
      <div className='summonerInfoButtonsWrapper'>
      <div className='summonerInfoButtons'>
        <Link to={`/summoner/${barRegion}/${summonerName}`} onClick={() => setActiveButton('summary')} className={activeButton === 'summary' ? 'activeButton' : 'buttonPagesInfo'}>Summary</Link>
        <Link to={`/summoner/${barRegion}/${summonerName}/maestry`} onClick={() => setActiveButton('maestry')} className={activeButton === 'maestry' ? 'activeButton' : 'buttonPagesInfo'}>Maestry</Link>
        <Link to={`/summoner/${barRegion}/${summonerName}/compare`} onClick={() => setActiveButton('compare')} className={activeButton === 'compare' ? 'activeButton' : 'buttonPagesInfo'}>Compare</Link>
        <Link to={`/summoner/${barRegion}/${summonerName}/live`} onClick={() => setActiveButton('live')} className={activeButton === 'live' ? 'activeButton' : 'buttonPagesInfo'}>Live Game</Link>
      </div>
      </div>
    </div>
  );
}