import React, { useEffect, useState } from "react";
import "./CommandInterface.css";

import Draggable from "react-draggable";
import CMDCombobox from "./CMDCombobox/CMDCombobox";
import { Configurationsfactory } from "../../mpce/configurationsfactory";
import { UserInteractionInterface } from "../../mpce/userinteractioninterface";

export default function CommandInterface({isVisible}) {
    const [text, setText] = useState("");
    const [historyCounter, setHistoryCounter] = useState(-1);
    const [callsHistory, setCallsHistory] = useState([]);
    const [currentSpacecraftInterface, setCurrentSpacecraftInterface] = useState(null);

    const internalCommands = ["clear()"];

    const sendCommand = (functionName, params) => {

        const requestId = Math.random().toString(36).slice(2);

        currentSpacecraftInterface.current?.contentWindow.postMessage(
        { type: "commands-interface-request", functionName, params, requestId},
        "*");
    };

    useEffect(() => {
        const listener = async (event) => {
            const { type, result, error} = event.data || {};

            if (type === "commands-interface-response" && event.source === currentSpacecraftInterface.current?.contentWindow)
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

    const spacecraftNames = Configurationsfactory.getConfiguration("TEST_ENVIRONMENT").spaceCrafts
        .filter(item => item.isManned == true)
        .map(item => item.displayName)
        .sort();

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

        if (internalCommands.includes(str))
        {
            handleInternalCommand(str);
        }
        else
        {
            const [, name, argsStr] = match;
            const args = argsStr
                ? JSON.parse(`[${argsStr.replace(/'/g, '"')}]`)
                : [];

            sendCommand(name, args);
        }
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

    const handlOnSelectedChanged = (newItem) =>{
        const iframe = UserInteractionInterface.getIframe(newItem);
        console.log(newItem)
        setCurrentSpacecraftInterface(iframe);
    }

    return (   
        isVisible && (
            <Draggable handle=".header">
                <div className="draggable-window">
                    <div className="header">
                        <CMDCombobox onSelectChange={handlOnSelectedChanged} spacecrafts={spacecraftNames}></CMDCombobox>
                    </div>
                    <textarea
                        id="field"
                        value={text}
                        onChange={(e) => {setText(e.target.value)}}
                        onKeyDown={handleKeyDown}
                        placeholder="command interface"/>
                </div>
            </Draggable>
        )
    );
}