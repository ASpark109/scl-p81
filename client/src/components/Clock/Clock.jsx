import React, { useState, useEffect } from 'react';

const Clock = () => {
    const [time, setTime] = useState("");

    useEffect(() => {
        function updateClock() {
            const now = new Date();
            const hours = String(now.getUTCHours()).padStart(2, "0");
            const minutes = String(now.getUTCMinutes()).padStart(2, "0");
            const seconds = String(now.getUTCSeconds()).padStart(2, "0");
            setTime(`${hours}:${minutes}:${seconds} UTC`);
        }

        updateClock();
        const interval = setInterval(updateClock, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ color: "#00ff00", fontFamily: "'Orbitron', 'Courier New', monospace", fontSize: "15px", marginLeft: "50px" }}>
            {time}
        </div>
    );
};

export default Clock;