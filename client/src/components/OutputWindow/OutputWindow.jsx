import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import "./OutputWindow.css";

const OutputWindow = () => {

const [logs, setLogs] = useState([]);

OutputWindow.receiveLog = (msg) => {
    setLogs((prev) => [...prev, msg]);
};

return (
    <div className='OutputWindow'>
        <pre>{logs.join('\n')}</pre>
    </div>
)}

export default OutputWindow