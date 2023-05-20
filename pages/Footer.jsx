import React from "react";
import "../css/Footer.css"
import {Link} from "react-router-dom";

export default function Footer(){

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  return(
    <div className="footerWrapper">
      <div className="footer">
        <div className="info">

          <div className="ulHolder">
            <ul>
              <li>RAFTE.CH</li>
              <li><Link to={"/about"} onClick={scrollToTop}>About RAFTE.CH</Link></li>
              <li><Link to={"/company"} onClick={scrollToTop}>Company</Link></li>
            </ul>
            <ul>
              <li>Resources</li>
              <li><Link to={"/privacy-policy"} onClick={scrollToTop}>Privacy Policy</Link></li>
              <li><Link to={"/tos"} onClick={scrollToTop}>Terms of Use</Link></li>
            </ul>
            <ul>
              <li>More</li>
              <li><Link to={"/contact"} onClick={scrollToTop}>Contact</Link></li>
              <li><Link to={"/advertise"} onClick={scrollToTop}>Advertise</Link></li>
              <li><Link to={"/faq"} onClick={scrollToTop}>FAQ</Link></li>
            </ul>
          </div>

          <span className="INFO"><small>© 2021-2023 RAFTE.CH isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.</small></span>
        </div>
      </div>
    </div>
  );

}