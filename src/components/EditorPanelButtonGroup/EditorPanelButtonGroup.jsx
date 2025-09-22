import React from "react";
import "./EditorPanelButtonGroup.css"
import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Configurationsfactory } from "../../mpce/configurationsfactory";

const EditorPanelButtonGroup = ({ onSelectChange }) => {

    let displayAreaScaleConf = Configurationsfactory.getConfiguration("TEST_ENVIRONMENT");

    const spacecrafts = displayAreaScaleConf.spaceCrafts.map(item => item.displayName);

    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(spacecrafts.length > 0 ? spacecrafts[0] : "");

    useEffect(() => {
        if (selected)
        {
            onSelectChange(selected);
        }
    }, []);

    return (
    <div className="dropdown">
        <button className="dropbtn" onClick={() => {setIsOpen(!isOpen)}}>
            <span>{selected}</span>
        </button>

        {isOpen && (
            <div className="dropdown-content">
                <ul>
                    {
                        spacecrafts.map((item, index) => (
                            <li
                                className="contentBtn"
                                key={index} 
                                onClick = {
                                    () => {
                                        if (item !== selected) {setSelected(item)}
                                        onSelectChange(item)
                                        setIsOpen(false);
                                    }
                                }>
                                {item}
                            </li>
                        ))
                    }
                </ul>
            </div>
        )}
    </div>
  );
};

export default EditorPanelButtonGroup;