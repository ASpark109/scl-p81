import './App.css';
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import DevelopmentArea from './components/DevelopmentArea/DevelopmentArea';
import CommandInterface from './components/CommandInterface/CommandInterface';
import GroundComSystem from './components/GroundComSystem/GroundComSystem';
import LiveMonitor from './components/LiveMonitor/LiveMonitor';

import { engineUpdater } from "./mpce/engineupdater";
import { getTestConfig } from './api/testEnvConfigs';

function App() {
  
    const [isProgramRunning, setTrigger] = useState(false);
    const [resetCounter, setResetCounter] = useState(0);
    const [saveCounter, setSaveCounter] = useState(0);
    const [isCMDVisible, setIsCMDVisible] = useState(false);
    const [isGCSVisible, setIsGCSVisible] = useState(false);
    const [activeView, setActiveView] = useState("dev");
    const [submitCounter, setSubmitCounter] = useState(0);
    const [configuraion, setConfiguration] = useState(null);
    const [codeEditorInitConf, setCodeEditorInitConf] = useState([]);

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

    const params = new URLSearchParams(window.location.search);
    const arg = params.get("arg") || "project1";

    const reloadWithNewEnvironment = (newArg) => {
        window.location.href = `/?arg=${newArg}`;
    };

    useEffect(() => {

        engineUpdater.start();

    }, []);

    useEffect(() => {
        const fetchConfig = async () => {
            const conf = await getTestConfig(arg + ".json");
            setConfiguration(conf);

            const codeEditorInitConf = {
                list:[
                    ...conf.spaceCrafts.map(item => ({
                        Name: item.Name,
                        displayName: item.displayName
                    })),
                    ...conf.groundCommunicationSystem.map(item => ({
                        Name: item.Name,
                        displayName: item.displayName
                }))],
                project: conf.project};

            setCodeEditorInitConf(codeEditorInitConf);
        };

        fetchConfig();
    }, []);
  
    return (
        <div className="AppRoot">
            {configuraion && codeEditorInitConf ? (
                <>
                    <Navbar onButtonClick={handleTrigger}
                            isProgramRunning={isProgramRunning}
                            isCMDVisible={isCMDVisible}
                            onNewEnvConfigurationSelected={reloadWithNewEnvironment}
                            selectedConfig={arg}/>
                    
                    <div style={{ display: activeView === "dev" ? "block" : "none" }}>
                        <DevelopmentArea trigger={isProgramRunning} resetTrigger={resetCounter} saveTrigger={saveCounter} submitTrigger={submitCounter} conf={configuraion} codeEditorConf={codeEditorInitConf} mode={"dev"}/>
                    </div>

                    {/* <div style={{ display: activeView === "rt" ? "block" : "none" }}>
                        <LiveMonitor mode={"rt"} conf={configuraion}/>
                    </div> */}

                    <CommandInterface isVisible={isCMDVisible} mode={activeView} spaceCrafts={configuraion.spaceCrafts}></CommandInterface>
                    <GroundComSystem isVisible={isGCSVisible} mode={activeView}></GroundComSystem>
                </>
            ) : (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    color: "#00ff00",
                    padding: "20px",
                    fontSize: "18px"
                }}>
                    Loading configuration...
                </div>
            )}
        </div>
    );
}

export default App;