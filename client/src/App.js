import './App.css';
import React from "react";
import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import DevelopmentArea from './components/DevelopmentArea/DevelopmentArea';

function App() {
  
    const [isProgramRunning, setTrigger] = useState(false);
    const [resetCounter, setResetCounter] = useState(0);

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
            default:
                break;
        }
    };
  
    return (
        <div className="AppRoot">
            <Navbar onButtonClick={handleTrigger} isProgramRunning={isProgramRunning}/>
            <DevelopmentArea trigger={isProgramRunning} resetTrigger={resetCounter}/>
        </div>
    );
}

export default App;