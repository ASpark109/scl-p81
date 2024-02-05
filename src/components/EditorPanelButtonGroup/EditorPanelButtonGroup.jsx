// LanguageDropdown.js

import React from "react";
import Select from "react-select";
import { customStyles } from "../../script/customStyle";
// import { languageOptions } from "../constants/languageOptions";

const EditorPanelButtonGroup = ({ onSelectChange }) => {

    const languageOptions = [
        {
            id: 1,
            name: "JavaScript (Node.js 12.14.0)",
            label: "C",
            value: "javascript",
        },
        {
            id: 2,
            name: "JavaScript (Node.js 12.14.0)",
            label: "C++",
            value: "javascript",
        },
        {
            id: 3,
            name: "JavaScript (Node.js 12.14.0)",
            label: "Python",
            value: "javascript",
        },
    ]

    return (
    <Select
        placeholder={`Filter By Category`}
        options={languageOptions}
        styles={customStyles}
        defaultValue={languageOptions[0]}
    //   onChange={(selectedOption) => onSelectChange(selectedOption)}
    />
    );
};

export default EditorPanelButtonGroup;