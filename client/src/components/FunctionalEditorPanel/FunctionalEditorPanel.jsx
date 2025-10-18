// import React, {useState} from 'react';
// import {Link} from 'react-router-dom';
import "./FunctionalEditorPanel.css";
// import "../EditorPanelButtonGroup/EditorPanelButtonGroup"
import {AiFillCaretRight} from "react-icons/ai";
import {FaSquare} from "react-icons/fa";
import EditorPanelButtonGroup from '../EditorPanelButtonGroup/EditorPanelButtonGroup';

const FunctionalEditorPanel = ({onSpacecraftSelected}) => {

    return (
        <div className='functionalPanel'>
            <div className='rightContentBlock'>
                <EditorPanelButtonGroup onSelectChange={onSpacecraftSelected} className="testBtn"></EditorPanelButtonGroup>
            </div>
        </div>
        
    );

};

export default FunctionalEditorPanel;