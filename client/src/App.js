import './App.css';
import React from "react";
import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import DevelopmentArea from './components/DevelopmentArea/DevelopmentArea';
import CommandInterface from './components/CommandInterface/CommandInterface';

function App() {
  
    const [isProgramRunning, setTrigger] = useState(false);
    const [resetCounter, setResetCounter] = useState(0);
    const [saveCounter, setSaveCounter] = useState(0);
    const [isCMDVisible, setIsCMDVisible] = useState(false);

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
            case "cmd":
                setIsCMDVisible(prev => !prev);
                break;
            default:
                break;
        }
    };
  
    return (
        <div className="AppRoot">
            <Navbar onButtonClick={handleTrigger} isProgramRunning={isProgramRunning} isCMDVisible={isCMDVisible}/>
            <DevelopmentArea trigger={isProgramRunning} resetTrigger={resetCounter} saveTrigger={saveCounter}/>
            <CommandInterface isVisible={isCMDVisible}></CommandInterface>
        </div>
    );
}

export default App;