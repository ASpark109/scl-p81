import React from "react";
import { useState, useEffect } from "react";

import "./EditorPanelButtonGroup.css"

import { IoIosArrowDown } from "react-icons/io";
import { Configurationsfactory } from "../../mpce/configurationsfactory";
import { getFileNamesList } from "../../api/userSrcCode";

import { IoIosCheckmark } from "react-icons/io";

const EditorPanelButtonGroup = ({ onSelectChange }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [spacecraftNames, setSpacecraftNames] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            const files = await getFileNamesList();
            setSpacecraftNames(files);

            if (files.length > 0)
            {
                setSelected(files[0]);
                onSelectChange(files[0]);
            }
        };
        fetchFiles();
    }, []);

    return (
    <div className="dropdown">
        <button className="dropbtn" onClick={() => {setIsOpen(!isOpen)}}>
            <span>{selected}</span>
        </button>

        {/* add animation */}
        {isOpen && (
            <div className={`dropdown-content ${isOpen ? "active" : ""}`}>
                {spacecraftNames.length > 0 && (
                    <ul>
                        {
                            spacecraftNames.map((item, index) => (
                                <li className="contentBtn"
                                    key={index} 
                                    onClick = {
                                        () => {
                                            if (item !== selected) {setSelected(item)}
                                            onSelectChange(item)
                                            setIsOpen(false);
                                        }
                                    }>
                                    <span>{item}</span>
                                    {item === selected && <IoIosCheckmark className="icon"/>}
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

export default EditorPanelButtonGroup;