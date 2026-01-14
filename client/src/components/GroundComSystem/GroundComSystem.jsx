import { useState, useEffect } from "react";
import "./GroundComSystem.css"

import Draggable from "react-draggable";

import { UserInteractionInterface } from "../../mpce/userinteractioninterface";

import { MdSatelliteAlt } from "react-icons/md";
import { LiaSatelliteDishSolid } from "react-icons/lia";

export default function GroundComSystem({isVisible, mode}) {
    const [text, setText] = useState("");
    const [binText, setBinText] = useState("");
    const [hexText, setHexText] = useState("");
    const [historyCounter, setHistoryCounter] = useState(-1);
    const [callsHistory, setCallsHistory] = useState([]);

    const GCSInterface = UserInteractionInterface.getIframe("graundComSystem", mode);

    const sendCommand = (functionName, params) => {

        const requestId = Math.random().toString(36).slice(2);

        GCSInterface.current?.contentWindow.postMessage(
        { type: "gcs-interface-request", functionName, params, requestId},
        "*");
    };

    useEffect(() => {
        const listener = async (event) => {
            const { type, result, error} = event.data || {};

            if (type === "gcs-interface-response" && event.source === GCSInterface.current?.contentWindow)
            {
                if (error)
                {
                    let str = "Error: " + error;
                    setText(text => text + "\n" + str + "\n");
                }
                else if (result)
                {
                    setText(text => text + "\n" + result + "\n");
                }
            }
        };
    
        window.addEventListener("message", listener);
        return () => window.removeEventListener("message", listener);
    });

    useEffect(() => {
        const listener = async (event) => {
            const { type, signal, bitRate} = event.data || {};

            if (type === "ground-communication-system")
            {
                let count = -1;

                const interval = setInterval(() => {
                    console.log(signal[count])
                    setHexText(hexText => hexText + signal[count].toString(16).toUpperCase() + " ");
                    setBinText(binText => binText + signal[count] + " ");

                    count++;

                    if (count == signal.length - 1) {
                        clearInterval(interval);
                    }
                }, 100);
            }
        };
    
        window.addEventListener("message", listener);
        return () => window.removeEventListener("message", listener);
    });

function handleInternalCommand(str)
    {
        switch(str)
        {
        case "clear()":
            setText("");
            break;
        default:
            return false;
        }

        return true;
    }

    function parseCall(str) {
        const match = str.trim().match(/^(\w+)\s*\((.*)\)$/);
        if (!match)
        {
            const errorMessage = `\n"${str}" is not recognized as an internal or external command\n`;
            setText(text => text + errorMessage);
            return;
        }

        const [, name, argsStr] = match;
        const args = argsStr
            ? JSON.parse(`[${argsStr.replace(/'/g, '"')}]`)
            : [];

        sendCommand(name, args);
    }

    const handleSend = () => {
        if (text.trim() !== "")
        {
            const lines = text.split("\n");
            const newCall = lines[lines.length - 1];
            parseCall(newCall);

            setCallsHistory(prevCalls => {
                if (prevCalls[prevCalls.length - 1] === newCall)
                    return [...prevCalls];

                return [...prevCalls, newCall]
            });
        }
    };

    const lastCommandFromHistory = (counter) => {
        if (text.trim() === "")
            return;

        const lines = text.split("\n");

        if (text[text.length - 1] !== "\n")
        {
            lines.pop();
            setText(lines.join("\n") + "\n");
        }

        setText(text => text + callsHistory[callsHistory.length - 1 - counter]);
    };
    
    const handleKeyDown = (e) => {
        
        switch(e.key)
        {
        case "Enter":
            if (!e.shiftKey)
            {
                e.preventDefault();
                handleSend();
                setHistoryCounter(-1);
            }
            break;
        case "ArrowUp":
            e.preventDefault();

            setHistoryCounter(prev => {
                const nextCounter = Math.min(prev + 1, callsHistory.length - 1);

                lastCommandFromHistory(nextCounter)

                return nextCounter;
            });
            break;
        case "ArrowDown":
            e.preventDefault();
            setHistoryCounter(prev => {
                const nextCounter = Math.max(prev - 1, 0);

                lastCommandFromHistory(nextCounter);

                return nextCounter;
            });
            break;
        }
    };

    return (
        isVisible && (<Draggable handle=".headergcs">
            <div className="draggable-windowgcs">
                <div className="containergcs" id="send">
                    <div className="headergcs">
                        <span style={{color: '#00b7ff'}}>Uplink</span>
                        <LiaSatelliteDishSolid className="icongcs" id="uplink"/>
                    </div>
                    <textarea
                        id="field"
                        value={text}
                        onChange={(e) => {setText(e.target.value)}}
                        onKeyDown={handleKeyDown}
                        placeholder="ground communication system"/>
                </div>
                <div className="containergcs" id="receive">
                    <div className="headergcs">
                        <span style={{color: '#00da49'}}>Downlink</span>
                        <MdSatelliteAlt className="icongcs" id="downlink"/>
                    </div>
                    <div className="signalDisplayContainer">
                        <div className="signalDisplay" id="hex">
                            <div className="numberedText">
                                {hexText}
                            </div>
                        </div>
                        <div className="signalDisplay" id="bin">
                            <div className="numberedText">
                                {binText} 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Draggable>)
    );
}