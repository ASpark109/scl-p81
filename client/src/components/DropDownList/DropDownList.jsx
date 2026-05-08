import React from "react";
import { useState, useEffect, useRef } from "react";

import "./DropDownList.css"

import { IoIosArrowDown } from "react-icons/io";
import { IoIosCheckmark } from "react-icons/io";

const DropDownList = ({ environmentsList = [], onSelectChange, selectedConfig}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(selectedConfig);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (environmentsList.length > 0 && selected === null) {
            setSelected(environmentsList[0]);
        }
    }, [environmentsList, selected]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
    <div className="dropdown" ref={dropdownRef}>
        <button className="dropbtn" onClick={() => {setIsOpen(!isOpen)}}>
            <span>{selected}</span>
        </button>

        {isOpen && (
            <div className={`dropdown-content ${isOpen ? "active" : ""}`}>
                {environmentsList.length > 0 && (
                    <ul>
                        {
                            environmentsList.map((item, index) => (
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

export default DropDownList;