import React from "react";
import { useState, useEffect } from "react";

import "./CMDCombobox.css"

import { IoIosCheckmark } from "react-icons/io";

const CMDCombobox = ({ onSelectChange, spacecrafts}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [spacecraftNames, setSpacecraftNames] = useState([]);

    useEffect(() => {
        if (spacecrafts.length !== 0)
        {
            setSpacecraftNames(spacecrafts);
            setSelected(spacecrafts[0]);
            onSelectChange(spacecrafts[0]);
        }
    }, []);

    return (
    <div className="dropdownCMD">
        <button className="dropbtnCMD" onClick={() => {setIsOpen(!isOpen)}}>
            <span>{selected}</span>
        </button>

        {isOpen && (
            <div className={`dropdown-contentCMD ${isOpen ? "active" : ""}`}>
                {spacecraftNames.length > 0 && (
                    <ul>
                        {
                            spacecraftNames.map((item, index) => (
                                <li className="contentBtnCMD"
                                    key={index} 
                                    onClick = {
                                        () => {
                                            if (item !== selected) {setSelected(item)}
                                            onSelectChange(item)
                                            setIsOpen(false);
                                        }
                                    }>
                                    <span>{item}</span>
                                    {item === selected && <IoIosCheckmark className="checkIconCMD"/>}
                                </li>
                            ))
                        }
                    </ul>
                )}
            </div>
        )}
    </div>
  );
};

export default CMDCombobox;