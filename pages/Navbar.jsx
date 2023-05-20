import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaProjectDiagram } from "react-icons/fa";
import {RiLinksFill} from "react-icons/ri"
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import '../css/Navbar.css';

export default function NavBar(props) {
  const { isDarkTheme, setIsDarkTheme } = props;
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const wrapperRef = useRef(null);

  useEffect(() => {
    const theme = localStorage.getItem('theme');

    if (theme === null) {
      setIsDarkTheme(true);
      localStorage.setItem('theme', 'dark');
    } else {
      setIsDarkTheme(theme === 'dark');
    }
  }, [setIsDarkTheme]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  
    const wrapperClass = isDarkTheme ? 'dark-theme' : 'light-theme';
    const wrapper = document.getElementById('root');
    wrapper.classList?.remove('dark-theme', 'light-theme');
    wrapper.classList?.add(wrapperClass);

  }, [isDarkTheme]);

  useEffect(() => {
    const screen = document.querySelector('.navItems');
    const items = document.querySelectorAll('.singleItem');
  
    function handleClickOutside(event) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].contains(event.target)) {
          return;
        }
      }
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsNavOpen(false);
      }
      screen.classList?.remove('open');
      document.body.classList.remove('no-scroll');
    }
  
    if (isNavOpen) {
      document.body.classList.add('no-scroll');
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavOpen]);


  return (
    <div className='navbarWrapper'>
      <div className='navbarLeft'>
        <div className='mainItemsNav'>
        <Link className='logo' to={'/'}><span className='logoText'>RAFTE.CH</span></Link>
        
        <div ref={wrapperRef} className={isNavOpen ? 'navItems navItemsCover open' : 'navItems navItemsCover'}>
          <Link className='singleItem' to={'/projects'} onClick={() => setIsNavOpen(false)}><FaProjectDiagram className='icon'/> Projects</Link>
          <Link className='singleItem' to={'/socials'} onClick={() => setIsNavOpen(false)}><RiLinksFill className='icon'/> Socials</Link>
        </div>
        </div>
        <button className='mobileBurger' onClick={toggleNav}><GiHamburgerMenu className='iconBurg'/></button>
      
      </div>

      <div className='navbarRight'>
        
        <button className='themeChange' onClick={() => {
          toggleTheme()
          
          }}>{isDarkTheme ? <BsFillSunFill className='sun'/> : <BsFillMoonFill className='moon'/>}</button>
        <Link to={'/login'} className='loginPage'>Login</Link>
      
      </div>

    </div>
  );
}