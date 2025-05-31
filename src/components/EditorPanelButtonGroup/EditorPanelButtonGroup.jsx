// LanguageDropdown.js

import React from "react";
import "./EditorPanelButtonGroup.css"
import { IoIosArrowDown } from "react-icons/io";
// import Select from "react-select";
// import { languageOptions } from "../constants/languageOptions";

const EditorPanelButtonGroup = ({ onSelectChange }) => {

    const languageOptions = [
        {
            id: 1,
            name: "",
            label: "0",
            value: 0,
        },
        {
            id: 2,
            name: "",
            label: "1",
            value: 1,
        },
        {
            id: 3,
            name: "",
            label: "2",
            value: 2,
        },
    ]

    return (
        <div class="dropdown">
            <button class="dropbtn">
                <span>Falcon 9 (apollo) A13MLK</span>
                <IoIosArrowDown className="icon" id="spacecraft-select-btn"/>
            </button>
            <div class="dropdown-content">
                <a href="#">Falcon 9 (first stage) AP782</a>
                <a href="#">Dragon KQ8</a>
                <a href="#">Mars (Sat) GU912A</a>
            </div>
        </div>
    );
};

export default EditorPanelButtonGroup;