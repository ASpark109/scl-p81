import './App.css';
import React from "react";
import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import DevelopmentArea from './components/DevelopmentArea/DevelopmentArea';

function App() {
  
    const [isProgramRunning, setTrigger] = useState(false);

    const handleTrigger = (btnType) => {
        switch (btnType)
        {
            case "run":
                setTrigger(() => true);
                break;
            case "stop":
                setTrigger(() => false);
                break;
            default:
                break;
        }
    };
  
    return (
        <div className="AppRoot">
            <Navbar onButtonClick={handleTrigger} isProgramRunning={isProgramRunning}/>
            <DevelopmentArea trigger={isProgramRunning}/>
        </div>
    );
}

export default App;