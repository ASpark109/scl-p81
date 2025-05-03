// LanguageDropdown.js

import React from "react";
import Select from "react-select";
import { customStyles } from "../../script/customStyle";
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
    <Select
        placeholder={`Filter By Category`}
        options={languageOptions}
        styles={customStyles}
        defaultValue={languageOptions[0]}
        onChange={(selectedOption) => onSelectChange(selectedOption)}
    />
    );
};

export default EditorPanelButtonGroup;