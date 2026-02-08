import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { AiOutlineClear } from "react-icons/ai";
import "./OutputWindow.css";

const OutputWindow = () => {

const [logs, setLogs] = useState([]);

useEffect(() =>
{
	const listener = (event) =>
	{
  		if (event.data?.type === "log")
		{
            const now = new Date();
            const timestamp = now.toTimeString().split(" ")[0];
            setLogs((prev) => [...prev,
                {
                    isError: event.data.isError,
                    text: event.data.payload,
                    timestamp: timestamp
                }
            ]);
  		}
	};

	window.addEventListener("message", listener);
    
	return () => window.removeEventListener("message", listener);
}, []);

const onClear = () =>
{
    setLogs([]);
}

return (
    <div className="OutputWindow">
        <div className="toolPanel">
            <button className="main-panel-button" onClick={() => onClear()}>
                <AiOutlineClear className="icon" id="clear-btn"/>
                <span>clear</span>
            </button>
        </div>
        {logs.map((log, i) => (
            <pre
                key={i}
                className={log.isError ? "logError" : ""}
            >
                <span className="timestamp">[{log.timestamp}]</span> {log.text}
            </pre>
        ))}
    </div>
)}

export default OutputWindow