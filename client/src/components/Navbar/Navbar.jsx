import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import "./Navbar.css";
import {FaSkype} from "react-icons/fa";
import {IoMdRocket} from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { ImStop2 } from "react-icons/im";
import { RiRadarLine } from "react-icons/ri";
import { RiRadarFill } from "react-icons/ri";
import { IoRocketSharp } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { IoPlanet } from "react-icons/io5";
import { FaWpexplorer } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import { BiReset } from "react-icons/bi";
import { HiOutlineCommandLine } from "react-icons/hi2";
import { FiSave } from "react-icons/fi";

const Navbar = ({ onButtonClick, isProgramRunning, isCMDVisible}) => {
    const [time, setTime] = useState("");

    useEffect(() => {
    function updateClock() {
      const now = new Date();

      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      const seconds = String(now.getUTCSeconds()).padStart(2, "0");

      setTime(`${hours}:${minutes}:${seconds} UTC`);
    }

    updateClock(); // одразу
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval); // важливо
  }, []);

  return (
    <nav className='navbar'>
        <div className='navbar-container'>
            <div className='navbar-content'>
                <button className="explore-button">
                    {/* <MdOutlineExplore className="icon" /> */}
                    <span>Documentation</span>
                </button>
            </div>

            <div className='navbar-content'>
                <div className='navbar-content tool-buttons'>
                    <button className={`main-panel-button ${isProgramRunning ? "inactive" : ""}`} onClick={() => onButtonClick("run")} disabled={isProgramRunning}>
                        <FaPlay className="icon" id="run-btn"/>
                        <span>Run</span>
                    </button>
                    <button className={`main-panel-button ${isProgramRunning ? "" : "inactive"}`} onClick={() => onButtonClick("stop")} disabled={!isProgramRunning}>
                        <ImStop2 className="icon" id="stop-btn"/>
                        <span>Stop</span>
                    </button>
                    <button className="main-panel-button" onClick={() => onButtonClick("reset")}>
                        <BiReset className="icon" id="res-btn"/>
                        <span>Reset</span>
                    </button>
                    
                    <div className="groupBorderNav"></div>

                    <button className="main-panel-button" onClick={() => onButtonClick("save")}>
                        <FiSave className="icon" id="sv-btn"/>
                        <span>Save</span>
                    </button>
                    <button className="main-panel-button" onClick={() => onButtonClick("submit")}>
                        <IoRocketSharp className="icon" id="sbm-btn"/>
                        <span>Submit</span>
                    </button>
                    <button className="main-panel-button" onClick={() => onButtonClick("gcs")}>
                        <RiRadarFill className="icon" id="dl-btn"/>
                        <span>Data link</span>
                    </button>

                    <div className="groupBorderNav"></div>

                    <button className="main-panel-icon-button" onClick={() => onButtonClick("cmd")}>
                        <HiOutlineCommandLine className={`icon ${isCMDVisible ? "icon--visible" : ""}`} id="cmd-btn"/>
                        {/* <span>Data link</span> */}
                    </button>
                </div>

                <div className='navbar-content'>
                    <div className="toggle-item" onClick={() => onButtonClick("development")}>
                        <input type="radio" id="html" name="language" value="HTML"/>
                        <label htmlFor="html">Development</label>
                    </div>

                    <div className="toggle-item">
                        <input type="radio" id="css" name="language" value="CSS"/>
                        <label htmlFor="css">Mission Configuration</label>
                    </div>

                    <div className="toggle-item" onClick={() => onButtonClick("liveMonitor")}>
                        <input type="radio" id="javascript" name="language" value="JavaScript"/>
                        <label htmlFor="javascript">Live Monitor</label>
                    </div>

                <div style={{ color: "#00ff00", fontFamily: "'Orbitron', 'Courier New', monospace", fontSize: "15px", marginLeft: "50px"}}>
                    {time}
                </div>

                </div>
            </div>

            <div className='navbar-content'>
                {/* <button className="right-panel-button">
                    <IoSettingsSharp className="icon"/>
                </button>
                <button className="right-panel-button">
                    <IoPlanet className="icon score" id="score-btn"/>
                    <span>911</span>
                </button>
                <button className="avatar-button">
                    <img id="img" src="/image.png" alt="Profile"/>
                </button> */}
                <button className="right-panel-button discuss">
                    <span>Discuss</span>
                </button>                 
            </div>
        </div>
    </nav>
  )
}

export default Navbar