import './App.css';
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import DevelopmentArea from './components/DevelopmentArea/DevelopmentArea';
import CommandInterface from './components/CommandInterface/CommandInterface';
import GroundComSystem from './components/GroundComSystem/GroundComSystem';
import LiveMonitor from './components/LiveMonitor/LiveMonitor';
import { engineUpdater } from "./mpce/engineupdater";

function App() {
  
    const [isProgramRunning, setTrigger] = useState(false);
    const [resetCounter, setResetCounter] = useState(0);
    const [saveCounter, setSaveCounter] = useState(0);
    const [isCMDVisible, setIsCMDVisible] = useState(false);
    const [isGCSVisible, setIsGCSVisible] = useState(false);
    const [activeView, setActiveView] = useState("dev");
    const [submitCounter, setSubmitCounter] = useState(0);

    const handleTrigger = (btnType) => {
        switch (btnType)
        {
            case "run":
                setTrigger(() => true);
                break;
            case "stop":
                setTrigger(() => false);
                break;
            case "reset":
                setResetCounter(prev => prev + 1);
                setTrigger(() => false);
                break;
            case "save":
                setSaveCounter(prev => prev + 1);
                break;
            case "submit":
                setSubmitCounter(prev => prev + 1);
                break;
            case "cmd":
                setIsCMDVisible(prev => !prev);
                break;
            case "gcs":
                setIsGCSVisible(prev => !prev);
                break;
            case "development":
                setActiveView(() => "dev");
                break;
            case "liveMonitor":
                setActiveView(() => "rt");
                break;
            default:
                break;
        }
    };

    useEffect(() => {

        engineUpdater.start();

    }, []);
  
    return (
        <div className="AppRoot">
            <Navbar onButtonClick={handleTrigger} isProgramRunning={isProgramRunning} isCMDVisible={isCMDVisible}/>
            
            <div style={{ display: activeView === "dev" ? "block" : "none" }}>
                <DevelopmentArea trigger={isProgramRunning} resetTrigger={resetCounter} saveTrigger={saveCounter} submitTrigger={submitCounter} mode={"dev"}/>
            </div>

            {/* <div style={{ display: activeView === 2 ? "block" : "none" }}>
                <DevelopmentArea trigger={isProgramRunning} resetTrigger={resetCounter} saveTrigger={saveCounter}/>
            </div> */}

            {/* <div style={{ display: activeView === "rt" ? "block" : "none" }}>
                <LiveMonitor mode={"rt"}/>
            </div> */}

            <CommandInterface isVisible={isCMDVisible} mode={activeView}></CommandInterface>
            <GroundComSystem isVisible={isGCSVisible} mode={activeView}></GroundComSystem>
        </div>
    );
}

export default App;